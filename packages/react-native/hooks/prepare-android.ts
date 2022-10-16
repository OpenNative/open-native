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
}: {
  dependencies: string[];
  projectDir: string;
  outputModulesJsonPath: string;
  outputModuleMapPath: string;
  outputPackagesJavaPath: string;
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
        exportedMethods,
        exportedModuleName,
        exportsConstants,
        moduleClassName,
        moduleClassNameJs,
        npmPackageName,
        packageImportPath,
        packageInstance,
        sourceDir,
      }) => ({
        absolutePath: sourceDir,
        androidProjectName,
        exportedMethods,
        exportedModuleName,
        exportsConstants,
        moduleClassName,
        moduleClassNameJs,
        packageImportPath,
        packageInstance,
        packageName: npmPackageName,
      })
    );

  await Promise.all([
    await writeModulesJsonFile({
      moduleInfo: autolinkingInfo.map(
        ({ packageName, absolutePath, androidProjectName }) => ({
          packageName,
          absolutePath,
          androidProjectName,
        })
      ),
      outputModulesJsonPath,
    }),

    await writePackagesJavaFile({
      moduleInfo: autolinkingInfo,
      outputPackagesJavaPath,
    }),

    await writeModuleMapFile({
      moduleMap: autolinkingInfo.reduce(
        (
          acc,
          {
            exportedMethods,
            exportedModuleName,
            exportsConstants,
            moduleClassNameJs,
          }
        ) => {
          acc[exportedModuleName] = {
            e: exportsConstants,
            j: moduleClassNameJs,
            m: exportedMethods.reduce(
              (
                innerAcc,
                { exportedMethodName, methodNameJs, methodTypesParsed }
              ) => {
                innerAcc[exportedMethodName] = {
                  j: methodNameJs,
                  t: methodTypesParsed,
                };
                return innerAcc;
              },
              {}
            ),
          };
          return acc;
        },
        {}
      ),
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
  const {
    exportedMethods,
    exportedModuleName,
    exportsConstants,
    moduleClassName,
    packageClassName,
  } = await parseSourceFiles(sourceDir);

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
    exportedMethods,
    /** @example 'RNTestModule' - as exported by getName() */
    exportedModuleName,
    exportsConstants,
    /** @example undefined */
    libraryName,
    /** @example 'RNTestModule' - the actual name of the Java class in Java */
    moduleClassName,
    /** @example 'RNTestModule' - the name of the Java class in NativeScript */
    moduleClassNameJs: moduleClassName,
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
  let moduleContents = '';
  let moduleDeclarationMatch: RegExpMatchArray | null = null;
  for (const file of files) {
    if (!packageDeclarationMatch) {
      packageDeclarationMatch = matchClassDeclarationForPackage(file);
    }
    if (!moduleDeclarationMatch) {
      moduleDeclarationMatch = matchClassDeclarationForModule(file);
      moduleContents = file;
    }
    if (packageDeclarationMatch && moduleDeclarationMatch) {
      break;
    }
  }

  if (!packageDeclarationMatch || !moduleDeclarationMatch) {
    return null;
  }

  const [, packageClassName] = packageDeclarationMatch;
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
        methodTypesParsed: methodTypesRaw.map((t) => parseJavaTypeToEnum(t)),
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
  const exportedModuleName = moduleContents
    .match(ANDROID_GET_NAME_FN_REGEX)?.[0]
    .match(ANDROID_MODULE_NAME_REGEX)?.[0]
    .replace(/"/g, '');

  return {
    exportedMethods,
    /** @example 'RNTestModule' */
    exportedModuleName,
    /** @example true */
    exportsConstants,
    /** @example 'RNTestModule' */
    moduleClassName,
    /** @example 'RNTestModulePackage' */
    packageClassName,
  };
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
  moduleInfo,
  outputModulesJsonPath,
}: {
  moduleInfo: {
    packageName: string;
    absolutePath: string;
    androidProjectName: string;
  }[];
  outputModulesJsonPath: string;
}) {
  return await writeFile(
    outputModulesJsonPath,
    JSON.stringify(moduleInfo, null, 2),
    { encoding: 'utf-8' }
  );
}

/**
 * @param {object} args
 * @param args.moduleInfo An array of module information, with fields as such:
 *   [{
 *       packageImportPath: 'import com.testmodule.RNTestModulePackage;',
 *       packageInstance: 'new RNTestModulePackage()'
 *   }]
 * @returns A Promise to write the Packages.java file into the specified
 *   location.
 */
async function writePackagesJavaFile({
  moduleInfo,
  outputPackagesJavaPath,
}: {
  moduleInfo: { packageImportPath: string; packageInstance: string }[];
  outputPackagesJavaPath: string;
}) {
  const contents = [
    'package com.bridge;',
    '',
    'import com.facebook.react.ReactPackage;',
    'import com.facebook.react.bridge.ReactApplicationContext;',
    '',
    '// Add all imports here:',
    ...moduleInfo.map(({ packageImportPath }) => packageImportPath),
    '',
    'import java.util.ArrayList;',
    'import java.util.Collections;',
    'import java.util.List;',
    '',
    'public class Packages {',
    '  public static List<ReactPackage> list = new ArrayList<>();',
    '  public static void init() {',
    '    // Register each package.',
    '    Collections.addAll(list,',
    ...moduleInfo.map(({ packageInstance }) => `      ${packageInstance},`),
    '    );',
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
const ANDROID_MODULE_NAME_REGEX = /(["'])(?:(?=(\\?))\2.)*?\1/gm;

function parseJavaTypeToEnum(javaType: string): RNJavaSerialisableType {
  // Splitting before the generic should be redundant (we erased them earlier),
  // but just in case the implementation changes in future.
  const splitBeforeGeneric = javaType.split('<')[0];

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
  if (splitBeforeGeneric.includes('Map')) {
    return RNJavaSerialisableType.nonnullObject;
  }
  if (splitBeforeGeneric.includes('Array')) {
    return RNJavaSerialisableType.nonnullArray;
  }
  if (splitBeforeGeneric.includes('Callback')) {
    return RNJavaSerialisableType.Callback;
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
  nonnullString, // String
  boolean, // Boolean
  nonnullBoolean, // boolean
  int, // Integer (deprecated)
  nonnullInt, // int (deprecated)
  double, // double
  nonnullDouble, // Double
  float, // Float (deprecated)
  nonnullFloat, // float (deprecated)
  nonnullArray, // ReadableArray
  nonnullObject, // ReadableMap
  Callback, // Callback
  Promise, // Promise
}
