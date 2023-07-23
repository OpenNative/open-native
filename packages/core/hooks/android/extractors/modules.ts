import * as path from 'path';
import { globProm } from '../common';
import { getModuleImportPath } from '../getters/module-import-path';
import { getModuleName, resolveVariableValue } from '../getters/module-name';
import { loadModuleContents } from '../writers/load-module-contents';

import { extractClassDeclarationForModule } from './class-declaration';
import { extractMethodParamTypes } from './module-param-types';
import { extractClassDeclarationForPackage } from './package-class-declaration';

const ANDROID_REACT_PROP_REGEX = /(?<=@ReactProp\(name.*=)(.*)(?=\))/gm;
const ANDROID_REACT_PROP_REGEX_2 = /(?<=@ReactProp\(name.*=)(.*)(?=,)/gm;

const ANDROID_REACT_PROP_DEFAULT_VALUE =
  /(?<=(defaultBoolean|defaultFloat|defaultDouble|defaultInt).*= )(.*)(?=\))/gm;
const ANDROID_REACT_PROP_METHOD_REGEX =
  /(?:@ReactProp\(name*.*\))[\s\S]*?public[\s\S]*?[{;]/gm;
const ANDROID_REACT_PROP_METHOD_REGEX_KT =
  /(?:@ReactProp\(name*.*\))[\s\S]*?fun[\s\S]*?[{;]/gm;

const ANDROID_METHOD_REGEX =
  /(?:@Override|@ReactMethod)[\s\S]*?public[\s\S]*?[{;]/gm;

function matchReactProp(method: string) {
  const annotation = method.split(')')[0] + ')';
  if (annotation.includes(',')) {
    return annotation.match(ANDROID_REACT_PROP_REGEX_2)[0].trim();
  }
  return annotation.match(ANDROID_REACT_PROP_REGEX)[0].trim();
}

export async function extractPackageModules(folder: string) {
  let filePaths = await globProm('**/+(*.java|*.kt)', { cwd: folder });
  filePaths = filePaths.map((filePath) => path.join(folder, filePath));

  const files = filePaths.map((filePath) => ({
    contents: loadModuleContents(filePath),
    path: filePath,
  }));

  // TODO: We should ideally strip comments before running any Regex.

  let packageDeclarationMatch: RegExpMatchArray | null = null;
  const moduleDeclarationMatches: {
    contents: string;
    match: RegExpMatchArray;
    superclassName: string;
    path: string;
    isPublic: boolean;
  }[] = [];

  for (const file of files) {
    if (!packageDeclarationMatch) {
      packageDeclarationMatch = extractClassDeclarationForPackage(
        file.contents
      );
    }

    const moduleDeclarationMatch = extractClassDeclarationForModule(
      file.contents
    );
    if (moduleDeclarationMatch) {
      const [moduleClassSignature] = moduleDeclarationMatch;

      const superclassName = moduleClassSignature.match(
        /(?:extends\s+|:)(\w+)/
      )?.[1];
      // if (!superclassName) {
      //   continue;
      // }
      moduleDeclarationMatches.push({
        contents: file.contents,
        match: moduleDeclarationMatch,
        superclassName,
        path: file.path,
        isPublic:
          file.contents.indexOf('public class') > -1 ||
          file.contents.includes('//#kotlin'),
      });
    }
  }

  if (!packageDeclarationMatch) {
    return null;
  }

  /**
   * A record of all method signatures found so far. Allows us to crudely check
   * whether an method lacking a @ReactMethod annotation is nonetheless
   * overriding a method that has that same annotation in the superclass.
   * @example
   * {
   *   NativeIntentAndroidSpec: Set { "getInitialURL[1,13]" }
   * }
   */
  const reactMethods: {
    [moduleClassName: string]: Set<string>;
  } = {};
  const exportedConstants: {
    [moduleClassName: string]: boolean;
  } = {};

  let modules = moduleDeclarationMatches
    // Sort all direct extensions of ReactContextBaseJavaModule (base classes)
    // before subclasses, so that we can look up which overridden methods are
    // overriding ReactClass.
    .sort((a, b) => {
      if (a.superclassName === 'ReactContextBaseJavaModule') {
        // Sort a before b
        return -1;
      }
      if (b.superclassName === 'ReactContextBaseJavaModule') {
        // Sort b before a;
        return 1;
      }
      return 0;
    })
    .map(
      ({
        contents: moduleContents,
        match: moduleDeclarationMatch,
        superclassName,
        path,
        isPublic,
      }) => {
        const [, moduleClassName] = moduleDeclarationMatch;
        if (!reactMethods[moduleClassName]) {
          reactMethods[moduleClassName] = new Set();
        }

        /**
         * @example
         * A ReactMethod directly declared:
         * ['@ReactMethod\n@Profile\n   public void testCallback(Callback callback) {']
         * @example
         * A method with an `@Override` annotation - we have to do a second pass to
         * check whether it's overriding a method that was annotated as a
         * ReactMethod on the superclass:
         * ['@Override\n@DoNotStrip\n   public abstract void getInitialURL(Promise promise);']
         */
        const potentialMethodMatches: RegExpMatchArray =
          ([
            ...(moduleContents.match(ANDROID_METHOD_REGEX) || []),
            ...(moduleContents.match(ANDROID_REACT_PROP_METHOD_REGEX) || []),
            ...(moduleContents.match(ANDROID_REACT_PROP_METHOD_REGEX_KT) || []),
          ] as RegExpMatchArray) ?? ([] as unknown as RegExpMatchArray);

        const exportsConstants =
          /getConstants\(\s*\)\s*{/m.test(moduleContents) ||
          exportedConstants[superclassName];
        exportedConstants[moduleClassName] = exportsConstants;
        const exportedMethods = potentialMethodMatches
          .map((raw) => {
            /**
             * Standardise to single-space.
             * @example ['@ReactMethod @Profile public void testCallback(Callback callback) {']
             * @example ['@Override @DoNotStrip public abstract void getInitialURL(Promise promise);']
             */
            raw = raw.replace(/\s+/g, ' ');

            const nativeDefinition = raw.split('{')[0].trim() + ';';

            const hasReactMethodAnnotation =
              raw.includes('@ReactMethod ') || raw.includes('@ReactMethod(');
            const hasReactPropAnnotation = raw.includes('@ReactProp');

            const isBlockingSynchronousMethod =
              /isBlockingSynchronousMethod\s*=\s*true/gm.test(
                raw
                  .split(/\)/)
                  .find((split) => split?.includes('@ReactMethod(')) || ''
              );
            let methodPropName = undefined;
            let defaultPropValue = undefined;
            if (hasReactPropAnnotation) {
              const prop = matchReactProp(raw);
              methodPropName = resolveVariableValue(
                prop,
                moduleContents,
                filePaths
              );

              defaultPropValue = raw
                .split('public')[0]
                .match(ANDROID_REACT_PROP_DEFAULT_VALUE)?.[0];
              if (defaultPropValue) {
                if (
                  defaultPropValue !== 'true' &&
                  defaultPropValue !== 'false'
                ) {
                  defaultPropValue = defaultPropValue.includes('.')
                    ? parseFloat(defaultPropValue)
                    : parseInt(defaultPropValue);
                } else {
                  defaultPropValue =
                    defaultPropValue === 'false' ? false : true;
                }
              }
            }

            /**
             * Remove annotations & comments.
             *
             * We assume that exported methods start with public &
             * anything before that is not needed.
             *
             * @example ['public void testCallback(Callback callback) {']
             * @example ['public abstract void getInitialURL(Promise promise);']
             */
            raw = raw.includes('fun ')
              ? 'fun' + raw.split('fun')[1]
              : 'public' + raw.split('public')[1];

            /**
             * Remove the trailing brace.
             * @example ['public void testCallback(Callback callback)']
             * @example ['public abstract void getInitialURL(Promise promise)']
             */
            const signature = raw.replace(/\s*[{;]$/, '');

            const [
              /**
               * The signature leading up to the first bracket.
               * @example ['public void testCallback']
               * @example ['public abstract void getInitialURL']
               */
              signatureBeforeParams,
              /**
               * The signature following after the first bracket.
               * @example ['Callback callback)']
               * @example ['Promise promise)']
               */
              signatureFromParams = '',
            ] = signature.split(/\(/);

            /**
             * @example ['public', 'void', 'testCallback']
             * @example ['public', 'abstract' 'void', 'getInitialURL']
             */
            const signatureBeforeParamsSplit =
              signatureBeforeParams.split(/\s+/);
            /**
             * @example 'testCallback'
             * @example 'getInitialURL'
             */
            const methodNameJava = signatureBeforeParamsSplit.slice(-1)[0];
            /** @example 'void' */
            const returnType = signatureBeforeParamsSplit.slice(-2)[0];

            /**
             * Erase generic args and then split around commas to get params.
             * We filter out falsy params because it's possible to get
             * ['void', ''] when the signature has no params.
             * @example ['void', 'Callback callback']
             * @example ['void', 'Promise promise']
             * @example ['void', 'ReadableMap', 'ReadableArray', 'Promise promise']
             */
            const methodTypesRaw = [
              returnType,
              ...signatureFromParams
                .replace(/\)$/, '')
                .trim()
                .replace(/<.*>/g, '')
                .split(/\s*,\s*/)
                .filter((param) => param),
            ];

            const methodTypesParsed = methodTypesRaw.map((t) =>
              extractMethodParamTypes(t)
            );

            if (hasReactMethodAnnotation || hasReactPropAnnotation) {
              reactMethods[moduleClassName]?.add(methodNameJava);
            }
            // Discard any @Override methods for which we haven't encountered a
            // corresponding @ReactMethod-annotated one in the superclass. We
            // don't bother maintaining a chain of subclasses and digging
            // through them, as the general cases should be either a direct
            // subclass of ReactContextBaseJavaModule or a subclass of a spec
            // (that itself directly subclasses ReactContextBaseJavaModule).
            else if (!reactMethods[superclassName]?.has(methodNameJava)) {
              return null;
            }
            return {
              exportedMethodName: methodNameJava,
              isBlockingSynchronousMethod,
              methodNameJava,
              methodNameJs: methodNameJava,
              methodTypesParsed,
              methodTypesRaw,
              returnType,
              signature,
              prop: methodPropName,
              defaultValue: defaultPropValue,
              nativeDefinition: `Native definition for this prop in Java:
\`\`\`java
/${nativeDefinition}
\`\`\``,
            };
          })
          .filter((obj) => obj?.signature);

        /**
         * We chain together these operations:
         * @example ['public String getName() {\n    return "RNTestModule";\n  }']
         * @example ['"RNTestModule"']
         * @example 'RNTestModule'
         */
        const exportedModuleName = getModuleName(moduleContents, filePaths);
        const moduleImportPath = getModuleImportPath(moduleContents);
        return {
          exportedMethods,
          /** @example 'RNTestModule' or `null` if missing, e.g. for specs */
          exportedModuleName,
          /** @example true */
          exportsConstants,
          /** @example 'RNTestModule' */
          moduleClassName,
          /** @example 'com.facebook.react.modules.intent' */
          moduleImportPath,
          /** @example @ReactProp(name = "color") */
          isReactViewManager: moduleContents.includes('@ReactProp'),
          isPublic: isPublic,
        };
      }
    );

  // We reassign modules (rather than continuing to chain it) here purely so
  // that we can refer to `typeof modules` to express the complex type through
  // inference.
  modules = modules.reduce<typeof modules>((acc, mod) => {
    if (!mod.exportedModuleName) {
      // Filter out specs (identified by having `null` for exportedModuleName)
      // now that they've done their job of informing of any
      // @ReactMethod-annotated methods to know about in subclasses.
      return acc;
    }

    const matchingIndex = acc.findIndex(
      (m) =>
        m.exportedModuleName === mod.exportedModuleName &&
        mod.isReactViewManager === m.isReactViewManager
    );

    // If there's no previous module bearing this exportedModuleName, simply
    // include it.
    if (matchingIndex === -1) {
      acc.push(mod);
      return acc;
    }

    // If there *is* a previous module bearing this exportedModuleName, but it
    // has no exportedMethods (because it holds the implementation but not the
    // @ReactMethod annotations), then swap it for the one that does.
    if (!acc[matchingIndex].exportedMethods.length) {
      acc.splice(matchingIndex, 1, mod);
    }

    return acc;
  }, []);

  const [, packageClassName] = packageDeclarationMatch;

  return {
    modules,
    packageClassName,
  };
}
