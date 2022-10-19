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
  dependencies,
  projectDir,
  outputModulesJsonPath,
  outputModuleMapPath,
  outputPackagesJavaPath,
  outputIncludeGradlePath,
}: {
  dependencies: string[];
  projectDir: string;
  outputModulesJsonPath: string;
  outputModuleMapPath: string;
  outputPackagesJavaPath: string;
  outputIncludeGradlePath: string;
}) {
  const autolinkingInfo = (
    await Promise.all(
      dependencies.map((npmPackageName) =>
        mapPackageNameToAutolinkingInfo({ npmPackageName, projectDir })
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
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved).
 * @param args.userConfig The dependencies[packageName]platforms.android section
 *   of react-native-config.js.
 */
async function mapPackageNameToAutolinkingInfo({
  npmPackageName,
  projectDir,
  userConfig = {},
}: {
  npmPackageName: string;
  projectDir: string;
  userConfig?: AndroidDependencyParams;
}) {
  const npmPackagePath = path.dirname(
    require.resolve(`${npmPackageName}/package.json`, { paths: [projectDir] })
  );

  // This empty userConfig is a stub to reduce refactoring if we come to support
  // react-native.config.js in future.
  // https://github.com/react-native-community/cli/blob/4a6e64dad57536e4e64eb68471511463269d35d5/docs/dependencies.md#dependency-interface

  const sourceDir = path.join(
    npmPackagePath,
    userConfig.sourceDir || 'android'
  );
  if (!(await exists(sourceDir))) {
    // Not an Android native module.
    return;
  }

  const manifestPath = userConfig.manifestPath
    ? path.join(sourceDir, userConfig.manifestPath)
    : await findManifest(sourceDir);
  if (!manifestPath) {
    return;
  }

  const androidPackageName =
    userConfig.packageName || (await getAndroidPackageName(manifestPath));
  const { modules, packageClassName } = await parseSourceFiles(sourceDir);

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
  const componentDescriptors =
    userConfig.componentDescriptors ||
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
    }) => {
      // I'm assuming that the module import will simply be the same as the package
      // import, but swapping the package name for the module name. I may be wrong!
      const moduleImportName = `${packageImportPath
        .replace(';', '')
        .replace(/import\s+/, '')
        .split('.')
        .slice(0, -1)
        .join('.')}.${moduleClassName}`;

      // Unlike with Obj-C methods, NativeScript doesn't have to sanitise Java class
      // names for JS as far as I know.
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
        /** @example 'RNTestModule' - the name of the Java class in NativeScript */
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
    /** @example 'ammarahm-ed_react-native-module-test' */
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
    /** @example '@ammarahm-ed/react-native-module-test' */
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
  const filePaths = await globProm('**/+(*.java|*.kt)', { cwd: folder });

  const files = await Promise.all(
    filePaths.map((filePath) => readFile(path.join(folder, filePath), 'utf8'))
  );

  // TODO: We should ideally strip comments before running any Regex.

  let packageDeclarationMatch: RegExpMatchArray | null = null;
  const moduleDeclarationMatches: {
    contents: string;
    match: RegExpMatchArray;
  }[] = [];

  for (const file of files) {
    if (!packageDeclarationMatch) {
      packageDeclarationMatch = matchClassDeclarationForPackage(file);
    }
    const moduleDeclarationMatch = matchClassDeclarationForModule(file);
    if (moduleDeclarationMatch) {
      moduleDeclarationMatches.push({
        contents: file,
        match: moduleDeclarationMatch,
      });
    }
  }

  if (!packageDeclarationMatch) {
    return null;
  }

  const [, packageClassName] = packageDeclarationMatch;

  const modules = moduleDeclarationMatches.map(
    ({ contents: moduleContents, match: moduleDeclarationMatch }) => {
      const [, moduleClassName] = moduleDeclarationMatch;

      /** @example ['@ReactMethod\n@Profile\n   public void testCallback(Callback callback) {'] */
      const exportedMethodMatches =
        moduleContents.match(ANDROID_METHOD_REGEX) ?? [];
      const exportsConstants = /@Override\s+.*\s+getConstants\(\s*\)\s*{/m.test(
        moduleContents
      );

      const exportedMethods = exportedMethodMatches
        .map((raw) => {
          /**
           * Standardise to single-space.
           * @example ['@ReactMethod @Profile public void testCallback(Callback callback) {']
           */
          raw = raw.replace(/\s+/g, ' ');

          const isBlockingSynchronousMethod =
            /isBlockingSynchronousMethod\s*=\s*true/.test(
              raw.split(/\)/).find((split) => split.includes('@ReactMethod('))
            );

          /**
           * Remove annotations.
           * @example ['public void testCallback(Callback callback) {']
           */
          raw = raw.split(/@[a-zA-Z]*\s+/).slice(-1)[0];

          /**
           * Remove the trailing brace.
           * @example ['public void testCallback(Callback callback)']
           */
          const signature = raw.split(/\s*{/)[0];

          const [
            /**
             * The signature leading up to the first bracket.
             * @example ['public void testCallback']
             */
            signatureBeforeParams,
            /**
             * The signature following after the first bracket.
             * @example ['Callback callback)']
             */
            signatureFromParams = '',
          ] = signature.split(/\(/);

          /** @example ['public', 'void', 'testCallback'] */
          const signatureBeforeParamsSplit = signatureBeforeParams.split(/\s+/);
          /** @example 'testCallback' */
          const methodNameJava = signatureBeforeParamsSplit.slice(-1)[0];
          /** @example 'void' */
          const returnType = signatureBeforeParamsSplit.slice(-2)[0];

          /**
           * Erase generic args and then split around commas to get params.
           * We filter out falsy params because it's possible to get ['void', '']
           * when the signature has no params.
           * @example ['void', 'Callback callback', 'ReadableMap', 'ReadableArray']
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

          return {
            exportedMethodName: methodNameJava,
            isBlockingSynchronousMethod,
            methodNameJava,
            methodNameJs: methodNameJava,
            methodTypesParsed: methodTypesRaw.map((t) =>
              parseJavaTypeToEnum(t)
            ),
            methodTypesRaw,
            returnType,
            signature,
          };
        })
        .filter((obj) => obj.signature);

      /**
       * We chain together these operations:
       * @example ['public String getName() {\n    return "RNTestModule";\n  }']
       * @example ['"RNTestModule"']
       * @example 'RNTestModule'
       */
      const exportedModuleName = getModuleName(moduleContents);

      return {
        exportedMethods,
        /** @example 'RNTestModule' */
        exportedModuleName,
        /** @example true */
        exportsConstants,
        /** @example 'RNTestModule' */
        moduleClassName,
      };
    }
  );

  return {
    modules,
    packageClassName,
  };
}

function getModuleName(moduleContents: string) {
  const getNameFunctionReturnValue = moduleContents
    .match(ANDROID_GET_NAME_FN_REGEX)?.[0]
    .match(ANDROID_MODULE_NAME_REGEX)?.[0]
    .trim();
  if (getNameFunctionReturnValue.startsWith(`"`))
    return getNameFunctionReturnValue.replace(/"/g, '');

  const variableDefinitionLine = moduleContents
    .split('\n')
    .find((line) => line.includes(`String ${getNameFunctionReturnValue}`));
  return variableDefinitionLine.split(`"`)[1];
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
 * @returns a RegExpArray matching the class declaration.
 * @example
 * [
 *   'class RNTestModule extends ReactContextBaseJavaModule',
 *   'RNTestModule',
 * ]
 */
function matchClassDeclarationForModule(file: string) {
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
    .filter(Boolean);

  // Filter out duplicates as it happens that libraries contain multiple outputs
  // due to package publishing.
  // TODO: consider using "codegenConfig" to avoid this.
  return Array.from(new Set(codegenComponent as string[]));
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
    ...packages.flatMap(({ modules }) =>
      modules.map(
        (m) =>
          `    moduleClasses.put("${m.exportedModuleName}", ${m.moduleClassName}.class);`
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
    ...projectNames.map(
      (projectName) => `implementation project(":${projectName}")`
    ),
    '}',
  ].join('\n');
  return await writeFile(outputIncludeGradlePath, contents, {
    encoding: 'utf-8',
  });
}

async function writeSettingsGradleFile(projectDir: string) {
  const settingsGradlePath = projectDir + '/platforms/android/settings.gradle';
  const settingsGradlePatch = `// Mark react-native patch
def reactNativePkgJson = new File(["node", "--print", "require.resolve('@ammarahm-ed/react-native/package.json')"].execute(null, rootDir).text.trim())
def reactNativeDir = reactNativePkgJson.getParentFile().absolutePath
import groovy.json.JsonSlurper
def modules = new JsonSlurper().parse(new File(reactNativeDir, "react-android/bridge/modules.json"));

include ':react'
project(":react").projectDir = new File(reactNativeDir, "react-android/react/")
include ':bridge'
project(":bridge").projectDir = new File(reactNativeDir, "react-android/bridge/")

modules.each {
  include ":\${it.androidProjectName}"
  project(":\${it.androidProjectName}").projectDir = new File(it.absolutePath)
}`;

  const currentSettingsGradle = await readFile(settingsGradlePath, {
    encoding: 'utf-8',
  });
  if (currentSettingsGradle.includes('Mark react-native patch')) return;
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

const ANDROID_METHOD_REGEX = /@ReactMethod+((.|\n)*?) {/gm;
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
