/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE-react-native-community-cli file in the root of this package.
 */
import * as fs from 'fs';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import * as path from 'path';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Given a list of dependencies, autolinks any podspecs found within them, using
 * the React Native Community CLI search rules.
 * @param {object} args
 * @param args.dependencies The names of the npm dependencies to examine for
 *   autolinking.
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved).
 * @param args.outputModulesJsonPath An absolute path to output the modules.json
 *   to.
 * @param args.outputModuleMapPath An absolute path to output the modulemap.json
 *   to.
 * @param args.outputPackagesJavaPath An absolute path to output the
 *   Packages.java to.
 * @returns a list of package names in which podspecs were found and autolinked.
 */
export async function autolinkAndroid({
  packageDir,
  dependencies,
  projectDir,
  outputModulesJsonPath,
  outputModuleMapPath,
  outputPackagesJavaPath,
  outputIncludeGradlePath,
}: {
  packageDir: string;
  dependencies: string[];
  projectDir: string;
  outputModulesJsonPath: string;
  outputModuleMapPath: string;
  outputPackagesJavaPath: string;
  outputIncludeGradlePath: string;
}) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageDir, '/package.json'), {
      encoding: 'utf8',
    })
  );
  const autolinkingInfo = (
    await Promise.all(
      dependencies.map((npmPackageName) =>
        mapPackageNameToAutolinkingInfo({
          npmPackageName,
          projectDir,
          ownPackageName: packageJson.name,
        })
      )
    )
  )
    .filter((p) => !!p)
    .flat(1)
    .map(
      ({
        androidProjectName,
        modules,
        npmPackageName,
        packageImportPath,
        packageInstance,
        sourceDir,
      }) => ({
        absolutePath: sourceDir,
        androidProjectName,
        modules,
        packageImportPath,
        packageInstance,
        packageName: npmPackageName,
      })
    );
  await Promise.all([
    await writeSettingsGradleFile(projectDir),
    await writeModulesJsonFile({
      modules: autolinkingInfo.map(
        ({ packageName, absolutePath, androidProjectName }) => ({
          packageName,
          absolutePath,
          androidProjectName,
        })
      ),
      outputModulesJsonPath,
    }),

    await writePackagesJavaFile({
      packages: autolinkingInfo,
      outputPackagesJavaPath,
    }),

    await writeIncludeGradleFile({
      projectNames: autolinkingInfo.map(
        ({ androidProjectName }) => androidProjectName
      ),
      outputIncludeGradlePath,
    }),

    await writeModuleMapFile({
      // The autolinking info is essentially an array where each member
      // describes a package. Each package can have several modules, so we
      // reduce all the modules across all the packages into a single module
      // map.
      moduleMap: autolinkingInfo.reduce((acc, { modules }) => {
        modules.forEach(
          ({
            exportedMethods,
            exportedModuleName,
            exportsConstants,
            moduleImportNameJs,
          }) => {
            acc[exportedModuleName] = {
              e: exportsConstants,
              j: moduleImportNameJs,
              m: exportedMethods.reduce(
                (
                  innerAcc,
                  {
                    exportedMethodName,
                    isBlockingSynchronousMethod,
                    methodNameJs,
                    methodTypesParsed,
                  }
                ) => {
                  innerAcc[exportedMethodName] = {
                    b: isBlockingSynchronousMethod,
                    j: methodNameJs,
                    t: methodTypesParsed,
                  };
                  return innerAcc;
                },
                {}
              ),
            };
          }
        );

        return acc;
      }, {}),
      outputModuleMapPath,
    }),
  ]);

  return autolinkingInfo.map(({ packageName }) => packageName);
}

/**
 * @param {object} args
 * @param args.npmPackageName The package name, e.g. 'react-native-module-test'.
 * @param args.ownPackageName The name for the package holding this hook,
 *   e.g. 'open-native_core', which holds core modules rather than
 *   community modules. It'll look for the Android native modules for core by a
 *   special path.
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved).
 * @param args.userConfig The dependencies[packageName]platforms.android section
 *   of react-native-config.js.
 */
async function mapPackageNameToAutolinkingInfo({
  npmPackageName,
  ownPackageName,
  projectDir,
  // This empty userConfig is a stub to reduce refactoring if we come to support
  // react-native.config.js in future.
  // https://github.com/react-native-community/cli/blob/4a6e64dad57536e4e64eb68471511463269d35d5/docs/dependencies.md#dependency-interface
  userConfig = {},
}: {
  npmPackageName: string;
  ownPackageName: string;
  projectDir: string;
  userConfig?: AndroidDependencyParams;
}) {
  const npmPackagePath = path.dirname(
    require.resolve(`${npmPackageName}/package.json`, { paths: [projectDir] })
  );

  /**
   * Detect whether we're autolinking our own React Native bridge
   * implementation. If so, we'll adjust a few things because it's not a
   * standard native module.
   */
  const isCore = npmPackageName === ownPackageName;
  const sourceDir = path.join(
    npmPackagePath,
    isCore
      ? 'react-android/react/src/main/java/com/facebook'
      : userConfig.sourceDir || 'android'
  );
  if (!(await exists(sourceDir))) {
    // Not an Android native module.
    return;
  }

  const manifestPath = isCore
    ? path.join(
        npmPackagePath,
        'react-android/react/src/main/AndroidManifest.xml'
      )
    : userConfig.manifestPath
    ? path.join(sourceDir, userConfig.manifestPath)
    : await findManifest(sourceDir);
  if (!manifestPath) {
    return;
  }

  const androidPackageName =
    userConfig.packageName || (await getAndroidPackageName(manifestPath));
  const parsed = await parseSourceFiles(sourceDir);
  if (!parsed) {
    return null;
  }
  const { modules, packageClassName } = parsed;

  /**
   * This module has no package to export.
   */
  if (!packageClassName) {
    return null;
  }

  const packageImportPath =
    userConfig.packageImportPath ||
    `import ${androidPackageName}.${packageClassName};`;

  const packageInstance =
    userConfig.packageInstance || `new ${packageClassName}()`;

  const buildTypes = userConfig.buildTypes || [];
  const dependencyConfiguration = userConfig.dependencyConfiguration;
  const libraryName =
    userConfig.libraryName || findLibraryName(npmPackagePath, sourceDir);

  /**
   * At least so far, I'm not aware of us having any React components to export
   * from our core library, so we can skip this bit.
   */
  const componentDescriptors = isCore
    ? []
    : userConfig.componentDescriptors ||
      (await findComponentDescriptors(npmPackagePath));
  const androidMkPath = userConfig.androidMkPath
    ? path.join(sourceDir, userConfig.androidMkPath)
    : path.join(sourceDir, 'build/generated/source/codegen/jni/Android.mk');
  const cmakeListsPath = userConfig.cmakeListsPath
    ? path.join(sourceDir, userConfig.cmakeListsPath)
    : path.join(sourceDir, 'build/generated/source/codegen/jni/CMakeLists.txt');

  const modulesWithImportNames = modules.map(
    ({
      moduleClassName,
      exportedMethods,
      exportedModuleName,
      exportsConstants,
      moduleImportPath,
    }) => {
      const moduleImportName = `${moduleImportPath}.${moduleClassName}`;
      // Unlike with Obj-C methods, NativeScript doesn't have to sanitise Java
      // class names for JS as far as I know.
      const moduleClassNameJs = moduleClassName;
      const moduleImportNameJs = `${packageImportPath
        .replace(';', '')
        .replace(/import\s+/, '')
        .split('.')
        .slice(0, -1)
        .join('.')}.${moduleClassNameJs}`;

      return {
        exportedMethods,
        /** @example 'RNTestModule' - as exported by getName() */
        exportedModuleName,
        /** @example false - whether the module exports constants or not. */
        exportsConstants,
        /** @example 'RNTestModule' - the name of the Java class in Java */
        moduleClassName,
        /**
         * @example 'RNTestModule' - the name of the Java class in NativeScript.
         */
        moduleClassNameJs,
        /**
         * The name of the Java class in Java, with all namespacing.
         * @example 'com.test.RNTestModule'
         */
        moduleImportName,
        /**
         * The name of the Java class in NativeScript, with all namespacing.
         * @example 'com.test.RNTestModule'
         */
        moduleImportNameJs,
      };
    }
  );

  return {
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android/build/generated/source/codegen/jni/Android.mk' */
    androidMkPath,
    /** @example 'react-native-module-test' */
    androidProjectName: makeAndroidProjectName(npmPackageName),
    /** @example [] */
    buildTypes,
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android/build/generated/source/codegen/jni/CMakeLists.txt' */
    cmakeListsPath,
    /** @example [] */
    componentDescriptors,
    /** @example undefined */
    dependencyConfiguration,
    /** @example undefined */
    libraryName,
    modules: modulesWithImportNames,
    /** @example 'react-native-module-test' */
    npmPackageName,
    /** @example 'import com.testmodule.RNTestModulePackage;' */
    packageImportPath,
    /** @example 'new RNTestModulePackage()' */
    packageInstance,
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android' */
    sourceDir,
  };
}

export async function findManifest(folder: string): Promise<string | null> {
  const manifestPath = (
    await globProm(path.join('**', 'AndroidManifest.xml'), {
      cwd: folder,
      ignore: [
        'node_modules/**',
        '**/build/**',
        '**/debug/**',
        'Examples/**',
        'examples/**',
      ],
    })
  )[0];

  return manifestPath ? path.join(folder, manifestPath) : null;
}

function globProm(pattern: string, options: IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}

/**
 * Read in an Android manifest and extract the package name from it.
 */
export async function getAndroidPackageName(
  manifestPath: string
): Promise<string> {
  const bgRed = '\x1b[41m';
  const dim = '\x1b[2m';
  const underline = '\x1b[4m';
  const reset = '\x1b[0m';

  const androidManifest = await readFile(manifestPath, 'utf8');

  const packageNameMatchArray = androidManifest.match(/package="(.+?)"/);
  if (!packageNameMatchArray || packageNameMatchArray.length === 0) {
    throw new Error(
      `Failed to build the app: No package name found. Found errors in ${underline}${dim}${manifestPath}`
    );
  }

  const packageName = packageNameMatchArray[1];

  if (!validateAndroidPackageName(packageName)) {
    console.warn(
      `Invalid application's package name "${bgRed}${packageName}${reset}" in 'AndroidManifest.xml'. Read guidelines for setting the package name here: ${underline}${dim}https://developer.android.com/studio/build/application-id`
    );
  }
  return packageName;
}

function validateAndroidPackageName(packageName: string) {
  return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName);
}

async function parseSourceFiles(folder: string) {
  let filePaths = await globProm('**/+(*.java|*.kt)', { cwd: folder });
  filePaths = filePaths.map((filePath) => path.join(folder, filePath));
  const files = await Promise.all(
    filePaths.map((filePath) => readFile(filePath, 'utf8'))
  );

  // TODO: We should ideally strip comments before running any Regex.

  let packageDeclarationMatch: RegExpMatchArray | null = null;
  const moduleDeclarationMatches: {
    contents: string;
    match: RegExpMatchArray;
    superclassName: string;
  }[] = [];

  for (const file of files) {
    if (!packageDeclarationMatch) {
      packageDeclarationMatch = matchClassDeclarationForPackage(file);
    }

    const moduleDeclarationMatch = matchClassDeclarationForModule(file);
    if (moduleDeclarationMatch) {
      const [moduleClassSignature] = moduleDeclarationMatch;

      const superclassName = moduleClassSignature.match(
        /(?:extends\s+|:)(\w+)/
      )?.[1];
      if (!superclassName) {
        continue;
      }

      moduleDeclarationMatches.push({
        contents: file,
        match: moduleDeclarationMatch,
        superclassName,
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
          moduleContents.match(ANDROID_METHOD_REGEX) ?? [];
        const exportsConstants =
          /@Override\s+.*\s+getConstants\(\s*\)\s*{/m.test(moduleContents);

        const exportedMethods = potentialMethodMatches
          .map((raw) => {
            /**
             * Standardise to single-space.
             * @example ['@ReactMethod @Profile public void testCallback(Callback callback) {']
             * @example ['@Override @DoNotStrip public abstract void getInitialURL(Promise promise);']
             */
            raw = raw.replace(/\s+/g, ' ');

            const hasReactMethodAnnotation = raw.includes('@ReactMethod ');
            const isBlockingSynchronousMethod =
              /isBlockingSynchronousMethod\s*=\s*true/.test(
                raw.split(/\)/).find((split) => split.includes('@ReactMethod('))
              );

            /**
             * Remove annotations & comments.
             *
             * We assume that exported methods start with public &
             * anything before that is not needed.
             *
             * @example ['public void testCallback(Callback callback) {']
             * @example ['public abstract void getInitialURL(Promise promise);']
             */
            raw = 'public' + raw.split('public')[1];

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
              parseJavaTypeToEnum(t)
            );

            if (hasReactMethodAnnotation) {
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
      (m) => m.exportedModuleName === mod.exportedModuleName
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

const MODULE_IMPORT_PATH_REGEX = /(?<=package ).*(?=;)/gm;
/**
 * Get the module's import path from module file contents.
 * @param moduleContents
 * @returns
 */
function getModuleImportPath(moduleContents: string) {
  return moduleContents.match(MODULE_IMPORT_PATH_REGEX)?.[0];
}

/**
 * Gets the exported name for the module, or null if there's no such match.
 * @example 'IntentAndroid', for the class named 'IntentModule'.
 */
function getModuleName(moduleContents: string, files: string[]): string | null {
  let getNameFunctionReturnValue = moduleContents
    .match(ANDROID_GET_NAME_FN_REGEX)?.[0]
    .match(ANDROID_MODULE_NAME_REGEX)?.[0]
    .trim();
  // The module doesn't have a getName() method at all. It may be a spec, or not
  // a ReactModule in the first place.
  if (!getNameFunctionReturnValue) {
    return null;
  }
  let variableDefinitionLine;
  if (getNameFunctionReturnValue.startsWith(`"`))
    return getNameFunctionReturnValue.replace(/"/g, '');

  // Handle scoped variables such as RNTestCaseScopedNameVariable.NAME;
  // This will extract moduleName from the correct class by searching
  // the classes in the Package.
  if (getNameFunctionReturnValue.indexOf('.') > -1) {
    const split = getNameFunctionReturnValue.split('.');
    const className = split[0] + '.java';
    getNameFunctionReturnValue = split[1];
    for (const file of files) {
      if (file.includes(`/${className}`)) {
        variableDefinitionLine = fs
          .readFileSync(file, { encoding: 'utf-8' })
          .split('\n')
          .find((line) =>
            line.includes(`String ${getNameFunctionReturnValue}`)
          );
      }
    }
  }

  if (!variableDefinitionLine) {
    variableDefinitionLine = moduleContents
      .split('\n')
      .find((line) => line.includes(`String ${getNameFunctionReturnValue}`));
  }

  return variableDefinitionLine.split(`"`)[1];
}

/**
 * As Java supports method overloading, we'll make methods comparable using a
 * hash based on the method's name and types.
 */
function hashMethod(
  methodName: string,
  methodTypesParsed: RNJavaSerialisableType[]
) {
  return `${methodName}${JSON.stringify(methodTypesParsed)}`;
}

/**
 * @param file the contents of the *ModulePackage.java file.
 * @returns a RegExpArray matching the class declaration.
 * @example
 * [
 *   'class RNTestModulePackage implements ReactPackage',
 *   'RNTestModulePackage',
 * ]
 */
function matchClassDeclarationForPackage(file: string) {
  const nativeModuleMatch = file.match(
    /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*ReactPackage/
  );
  // We first check for implementation of ReactPackage to find native modules
  // and then for subclasses of TurboReactPackage to find turbo modules.
  if (nativeModuleMatch) {
    return nativeModuleMatch;
  } else {
    return file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*TurboReactPackage/
    );
  }
}

/**
 * @param file the contents of the *Module.java file.
 * @returns a RegExpArray matching class declarations of native modules.
 * @example
 * A ReactModule:
 * [
 *    '@ReactModule(name = IntentModule.NAME)\npublic class IntentModule extends NativeIntentAndroidSpec {',
 *    'IntentModule',
 * ]
 * @example
 * A TurboModule:
 * [
 *   'class NativeIntentAndroidSpec extends ReactContextBaseJavaModule implements ReactModuleWithSpec, TurboModule',
 *   'NativeIntentAndroidSpec',
 *   ' implements ',
 * ]
 * @example
 * ... or a classic native module:
 * [
 *   'class RNTestModule extends ReactContextBaseJavaModule',
 *   'RNTestModule',
 * ]
 */
function matchClassDeclarationForModule(file: string) {
  // Match any class with the @ReactModule annotation.
  const reactModuleMatch = file.match(
    /@ReactModule[\s\S]*class\s+(\w+[^(\s]*)[\s\w():]*.*{/
  );
  if (reactModuleMatch) {
    return reactModuleMatch;
  }

  // Match any class that implements TurboModule.
  const turboModuleMatch =
    /import\s+com\.facebook\.react\.turbomodule\.core\.interfaces\.TurboModule\s*;/.test(
      file
    ) &&
    file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*TurboModule/
    );
  if (turboModuleMatch) {
    return turboModuleMatch;
  }

  // Match any class that extends ReactContextBaseJavaModule.
  return file.match(
    /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*ReactContextBaseJavaModule/
  );
}

/**
 * Create a valid Android project name that corresponds uniquely to the npm
 * package name.
 */
function makeAndroidProjectName(npmPackageName: string) {
  return npmPackageName.replace(/@/g, '').replace(/\//g, '_');
}

type AndroidDependencyParams = {
  sourceDir?: string;
  manifestPath?: string;
  packageName?: string;
  dependencyConfiguration?: string;
  packageImportPath?: string;
  packageInstance?: string;
  buildTypes?: string[];
  libraryName?: string | null;
  componentDescriptors?: string[] | null;
  androidMkPath?: string | null;
  cmakeListsPath?: string | null;
};

function findLibraryName(root: string, sourceDir: string) {
  const packageJsonPath = path.join(root, 'package.json');
  const buildGradlePath = path.join(sourceDir, 'build.gradle');
  const buildGradleKtsPath = path.join(sourceDir, 'build.gradle.kts');

  // We first check if there is a codegenConfig.name inside the package.json file.
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.codegenConfig?.name) {
      return packageJson.codegenConfig.name;
    }
  }

  // If not, we check if the library specified it in the build.gradle file.
  let buildGradleContents = '';
  if (fs.existsSync(buildGradlePath)) {
    buildGradleContents = fs.readFileSync(buildGradlePath, 'utf-8');
  } else if (fs.existsSync(buildGradleKtsPath)) {
    buildGradleContents = fs.readFileSync(buildGradleKtsPath, 'utf-8');
  } else {
    return undefined;
  }

  const match = buildGradleContents.match(/libraryName = ["'](.+)["']/);

  if (match) {
    return match[1];
  } else {
    return undefined;
  }
}

export async function findComponentDescriptors(
  packageRoot: string
): Promise<string[]> {
  const filepaths = await globProm('**/+(*.js|*.jsx|*.ts|*.tsx)', {
    cwd: packageRoot,
    nodir: true,
  });

  const contentsArr = await Promise.all(
    filepaths.map((filePath) =>
      readFile(path.join(packageRoot, filePath), 'utf8')
    )
  );

  const codegenComponent = contentsArr
    .map(extractComponentDescriptors)
    .filter((c): c is string => !!c);

  // Filter out duplicates as it happens that libraries contain multiple outputs
  // due to package publishing.
  // TODO: consider using "codegenConfig" to avoid this.
  return Array.from(new Set(codegenComponent));
}

const CODEGEN_NATIVE_COMPONENT_REGEX =
  /codegenNativeComponent(<.*>)?\s*\(\s*["'`](\w+)["'`](,?[\s\S]+interfaceOnly:\s*(\w+))?/m;

export function extractComponentDescriptors(contents: string): string {
  const match = contents.match(CODEGEN_NATIVE_COMPONENT_REGEX);
  if (!(match?.[4] === 'true') && match?.[2]) {
    return `${match[2]}ComponentDescriptor`;
  }
  return null;
}

/**
 * @param {object} args
 * @param args.packageImportPaths An array of package import paths, e.g.:
 *   ['import com.testmodule.RNTestModulePackage;']
 * @param args.packageInstances A corresponding array of package instance
 *   instantiation strings, e.g.:
 *   ['new RNTestModulePackage()']
 * @returns A Promise to write the Packages.java file into the specified
 *   location.
 */
async function writeModulesJsonFile({
  modules,
  outputModulesJsonPath,
}: {
  modules: {
    packageName: string;
    absolutePath: string;
    androidProjectName: string;
  }[];
  outputModulesJsonPath: string;
}) {
  return await writeFile(
    outputModulesJsonPath,
    JSON.stringify(modules, null, 2),
    { encoding: 'utf-8' }
  );
}

/**
 * @param {object} args
 * @param args.packages An array of package information, with fields as such:
 *   [{
 *       packageImportPath: 'import com.testmodule.RNTestModulePackage;',
 *       packageInstance: 'new RNTestModulePackage()',
 *       modules: [{
 *         exportedModuleName: "RNTestModule",
 *         moduleClassName: "RNTestModule",
 *         moduleImportName: "com.testmodule.RNTestModule"
 *       }]
 *   }]
 * @returns A Promise to write the Packages.java file into the specified
 *   location.
 */
async function writePackagesJavaFile({
  packages,
  outputPackagesJavaPath,
}: {
  packages: {
    packageImportPath: string;
    packageInstance: string;
    packageName: string;
    modules: {
      exportedModuleName: string;
      moduleImportName: string;
      moduleClassName: string;
    }[];
  }[];
  outputPackagesJavaPath: string;
}) {
  const contents = [
    'package com.bridge;',
    '',
    'import com.facebook.react.ReactPackage;',
    '',
    '// Import all module packages',
    ...packages.map(({ packageImportPath }) => packageImportPath),
    '',
    '// Import all module classes',
    ...packages.flatMap(({ modules }) =>
      modules.map((m) => `import ${m.moduleImportName};`)
    ),
    '',
    'import java.util.ArrayList;',
    'import java.util.Collections;',
    'import java.util.HashMap;',
    'import java.util.List;',
    '',
    'public class Packages {',
    '  public static List<ReactPackage> list = new ArrayList<>();',
    '  public static HashMap<String, Class> moduleClasses = new HashMap<>();',
    '  public static HashMap<String, String> modulePackageMap = new HashMap<>();',
    '',
    '  public static void init() {',
    "    // Register each package - we hopefully won't be using this for loading",
    '    // modules, as it breaks lazy loading logic',
    '    Collections.addAll(list,',
    ...packages.map(
      ({ packageInstance }, index) =>
        `      ${packageInstance}${index === packages.length - 1 ? '' : ','}`
    ),
    '    );',
    '',
    '    // Register each module class so that we can lazily access modules upon',
    '    // first function call',
    ...packages.flatMap(({ modules, packageImportPath }) =>
      modules.map((m) =>
        [
          `    moduleClasses.put("${m.exportedModuleName}", ${m.moduleClassName}.class);`,
          `    modulePackageMap.put("${m.moduleClassName}", "${packageImportPath
            .split('.')
            .pop()
            .replace(';', '')}");`,
        ].join('\n')
      )
    ),
    '',
    '  }',
    '}',
    '',
  ].join('\n');

  return await writeFile(outputPackagesJavaPath, contents, {
    encoding: 'utf-8',
  });
}

/**
 * @param {object} args
 * @param args.projectNames An array of android project names
 * @returns A Promise to write the include.gradle file into the specified
 * location.
 */
async function writeIncludeGradleFile({
  projectNames,
  outputIncludeGradlePath,
}: {
  projectNames: string[];
  outputIncludeGradlePath: string;
}) {
  const contents = [
    'dependencies {',
    'implementation project(":bridge")',
    ...projectNames
      .filter((projectName) => projectName !== 'open-native_core')
      .map((projectName) => `implementation project(":${projectName}")`),
    '}',
  ].join('\n');
  return await writeFile(outputIncludeGradlePath, contents, {
    encoding: 'utf-8',
  });
}

async function writeSettingsGradleFile(projectDir: string) {
  const settingsGradlePath = projectDir + '/platforms/android/settings.gradle';
  const settingsGradlePatch = `// Mark open-native_core patch
def reactNativePkgJson = new File(["node", "--print", "require.resolve('@open-native/core/package.json')"].execute(null, rootDir).text.trim())
def reactNativeDir = reactNativePkgJson.getParentFile().absolutePath
import groovy.json.JsonSlurper
def modules = new JsonSlurper().parse(new File(reactNativeDir, "react-android/bridge/modules.json"));

include ':react'
project(":react").projectDir = new File(reactNativeDir, "react-android/react/")
include ':bridge'
project(":bridge").projectDir = new File(reactNativeDir, "react-android/bridge/")

def selfModuleName = "open-native_core"
modules.each {
  if (!it.androidProjectName.equals(selfModuleName)) {
    include ":\${it.androidProjectName}"
    project(":\${it.androidProjectName}").projectDir = new File(it.absolutePath)
  }
}
`;

  const currentSettingsGradle = await readFile(settingsGradlePath, {
    encoding: 'utf-8',
  });
  if (currentSettingsGradle.includes('Mark open-native_core patch')) return;
  return await writeFile(
    settingsGradlePath,
    [currentSettingsGradle, settingsGradlePatch].join('\n'),
    {
      encoding: 'utf-8',
    }
  );
}

/**
 * @param {object} args
 * @param args.moduleMap
 * @returns A Promise to write the modulemap.json file into the specified
 *   location.
 */
async function writeModuleMapFile({
  moduleMap,
  outputModuleMapPath,
}: {
  moduleMap: {
    [exportedModuleName: string]: {
      /** jsModuleName */
      j: string;
      /** exportsConstants */
      e: boolean;
      /** methods */
      m: {
        [methodName: string]: {
          /** isBlockingSynchronousMethod */
          b: boolean;
          /** jsMethodName */
          j: string;
          /** types */
          t: RNJavaSerialisableType[];
        };
      };
    };
  };
  outputModuleMapPath: string;
}) {
  return await writeFile(
    outputModuleMapPath,
    JSON.stringify(moduleMap, null, 2),
    {
      encoding: 'utf-8',
    }
  );
}

const ANDROID_METHOD_REGEX = /(?:@Override|@ReactMethod)[\s\S]*?[{;]/gm;
const ANDROID_GET_NAME_FN_REGEX =
  /public String getName\(\)[\s\S]*?\{[^}]*\}/gm;
const ANDROID_MODULE_NAME_REGEX = /(?<=return ).*(?=;)/gm;

function parseJavaTypeToEnum(javaType: string): RNJavaSerialisableType {
  // Splitting before the generic should be redundant (we erased them earlier),
  // but just in case the implementation changes in future.
  const splitBeforeGeneric = javaType.split('<')[0];

  if (splitBeforeGeneric.includes('@Nullable String')) {
    return RNJavaSerialisableType.string;
  }
  if (splitBeforeGeneric.includes('String')) {
    return RNJavaSerialisableType.nonnullString;
  }
  if (splitBeforeGeneric.includes('Integer')) {
    return RNJavaSerialisableType.int;
  }
  if (splitBeforeGeneric.includes('int')) {
    return RNJavaSerialisableType.nonnullInt;
  }
  if (splitBeforeGeneric.includes('Boolean')) {
    return RNJavaSerialisableType.boolean;
  }
  if (splitBeforeGeneric.includes('boolean')) {
    return RNJavaSerialisableType.nonnullBoolean;
  }
  if (splitBeforeGeneric.includes('Double')) {
    return RNJavaSerialisableType.double;
  }
  if (splitBeforeGeneric.includes('double')) {
    return RNJavaSerialisableType.nonnullDouble;
  }
  if (splitBeforeGeneric.includes('Float')) {
    return RNJavaSerialisableType.float;
  }
  if (splitBeforeGeneric.includes('float')) {
    return RNJavaSerialisableType.nonnullFloat;
  }
  if (splitBeforeGeneric.includes('@Nullable ReadableMap')) {
    return RNJavaSerialisableType.object;
  }
  if (splitBeforeGeneric.includes('ReadableMap')) {
    return RNJavaSerialisableType.nonnullObject;
  }
  if (splitBeforeGeneric.includes('@Nullable ReadableArray')) {
    return RNJavaSerialisableType.array;
  }
  if (splitBeforeGeneric.includes('ReadableArray')) {
    return RNJavaSerialisableType.nonnullArray;
  }
  if (splitBeforeGeneric.includes('@Nullable Callback')) {
    return RNJavaSerialisableType.Callback;
  }
  if (splitBeforeGeneric.includes('Callback')) {
    return RNJavaSerialisableType.nonnullCallback;
  }
  if (splitBeforeGeneric.includes('Promise')) {
    return RNJavaSerialisableType.Promise;
  }
  if (splitBeforeGeneric.includes('void')) {
    return RNJavaSerialisableType.void;
  }

  return RNJavaSerialisableType.other;
}

// FIXME: need to figure out a proper pattern for importing this from its own
// package (but outside the hooks directory, which has its own tsconfig). For
// now, we'll just have to maintain an identical copy of this enum within the
// hook.
enum RNJavaSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // @Nullable String
  nonnullString, // String
  boolean, // Boolean
  nonnullBoolean, // boolean
  int, // Integer (deprecated)
  nonnullInt, // int (deprecated)
  double, // double
  nonnullDouble, // Double
  float, // Float (deprecated)
  nonnullFloat, // float (deprecated)
  nonnullObject, // ReadableMap
  object, // @Nullable ReadableMap
  array, // @Nullable ReadableArray
  nonnullArray, // ReadableArray
  Callback, // @Nullable Callback
  nonnullCallback, // Callback
  Promise, // Promise
}
