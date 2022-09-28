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
 * @param args.outputPackagesJavaPath An absolute path to output the
 *   Packages.java to.
 * @returns a list of package names in which podspecs were found and autolinked.
 */
export async function autolinkAndroid({
  dependencies,
  projectDir,
  outputModulesJsonPath,
  outputPackagesJavaPath,
}: {
  dependencies: string[];
  projectDir: string;
  outputModulesJsonPath: string;
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
        npmPackageName,
        sourceDir,
        androidProjectName,
        packageImportPath,
        packageInstance,
      }) => ({
        packageName: npmPackageName,
        absolutePath: sourceDir,
        androidProjectName,
        packageImportPath,
        packageInstance,
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
  const packageClassName = await findPackageClassName(sourceDir);

  /**
   * This module has no package to export
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
    sourceDir,
    packageImportPath,
    packageInstance,
    buildTypes,
    dependencyConfiguration,
    libraryName,
    componentDescriptors,
    androidMkPath,
    cmakeListsPath,
    npmPackageName,
    androidProjectName: makeAndroidProjectName(npmPackageName),
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

async function findPackageClassName(folder: string) {
  const filePaths = await globProm('**/+(*.java|*.kt)', { cwd: folder });

  const files = await Promise.all(
    filePaths.map((filePath) => readFile(path.join(folder, filePath), 'utf8'))
  );

  const packages = files.map(matchClassName).filter((match) => match);

  return packages.length ? packages[0][1] : null;
}

function matchClassName(file: string) {
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
