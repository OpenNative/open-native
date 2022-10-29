'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.extractComponentDescriptors = exports.findComponentDescriptors = exports.getAndroidPackageName = exports.findManifest = exports.autolinkAndroid = void 0;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const util_1 = require('util');
const readFile = (0, util_1.promisify)(fs.readFile);
const writeFile = (0, util_1.promisify)(fs.writeFile);
const exists = (0, util_1.promisify)(fs.exists);
async function autolinkAndroid({ dependencies, projectDir, outputModulesJsonPath, outputModuleMapPath, outputPackagesJavaPath, outputIncludeGradlePath }) {
  const autolinkingInfo = (await Promise.all(dependencies.map((npmPackageName) => mapPackageNameToAutolinkingInfo({ npmPackageName, projectDir }))))
    .filter((p) => !!p)
    .flat(1)
    .map(({ androidProjectName, modules, npmPackageName, packageImportPath, packageInstance, sourceDir }) => ({
      absolutePath: sourceDir,
      androidProjectName,
      modules,
      packageImportPath,
      packageInstance,
      packageName: npmPackageName,
    }));
  await Promise.all([
    await writeSettingsGradleFile(projectDir),
    await writeModulesJsonFile({
      modules: autolinkingInfo.map(({ packageName, absolutePath, androidProjectName }) => ({
        packageName,
        absolutePath,
        androidProjectName,
      })),
      outputModulesJsonPath,
    }),
    await writePackagesJavaFile({
      packages: autolinkingInfo,
      outputPackagesJavaPath,
    }),
    await writeIncludeGradleFile({
      projectNames: autolinkingInfo.map(({ androidProjectName }) => androidProjectName),
      outputIncludeGradlePath,
    }),
    await writeModuleMapFile({
      moduleMap: autolinkingInfo.reduce((acc, { modules }) => {
        modules.forEach(({ exportedMethods, exportedModuleName, exportsConstants, moduleImportNameJs }) => {
          acc[exportedModuleName] = {
            e: exportsConstants,
            j: moduleImportNameJs,
            m: exportedMethods.reduce((innerAcc, { exportedMethodName, isBlockingSynchronousMethod, methodNameJs, methodTypesParsed }) => {
              innerAcc[exportedMethodName] = {
                b: isBlockingSynchronousMethod,
                j: methodNameJs,
                t: methodTypesParsed,
              };
              return innerAcc;
            }, {}),
          };
        });
        return acc;
      }, {}),
      outputModuleMapPath,
    }),
  ]);
  return autolinkingInfo.map(({ packageName }) => packageName);
}
exports.autolinkAndroid = autolinkAndroid;
async function mapPackageNameToAutolinkingInfo({ npmPackageName, projectDir, userConfig = {} }) {
  const npmPackagePath = path.dirname(require.resolve(`${npmPackageName}/package.json`, { paths: [projectDir] }));
  const sourceDir = path.join(npmPackagePath, userConfig.sourceDir || 'android');
  if (!(await exists(sourceDir))) {
    return;
  }
  const manifestPath = userConfig.manifestPath ? path.join(sourceDir, userConfig.manifestPath) : await findManifest(sourceDir);
  if (!manifestPath) {
    return;
  }
  const androidPackageName = userConfig.packageName || (await getAndroidPackageName(manifestPath));
  const { modules, packageClassName } = await parseSourceFiles(sourceDir);
  if (!packageClassName) {
    return null;
  }
  const packageImportPath = userConfig.packageImportPath || `import ${androidPackageName}.${packageClassName};`;
  const packageInstance = userConfig.packageInstance || `new ${packageClassName}()`;
  const buildTypes = userConfig.buildTypes || [];
  const dependencyConfiguration = userConfig.dependencyConfiguration;
  const libraryName = userConfig.libraryName || findLibraryName(npmPackagePath, sourceDir);
  const componentDescriptors = userConfig.componentDescriptors || (await findComponentDescriptors(npmPackagePath));
  const androidMkPath = userConfig.androidMkPath ? path.join(sourceDir, userConfig.androidMkPath) : path.join(sourceDir, 'build/generated/source/codegen/jni/Android.mk');
  const cmakeListsPath = userConfig.cmakeListsPath ? path.join(sourceDir, userConfig.cmakeListsPath) : path.join(sourceDir, 'build/generated/source/codegen/jni/CMakeLists.txt');
  const modulesWithImportNames = modules.map(({ moduleClassName, exportedMethods, exportedModuleName, exportsConstants }) => {
    const moduleImportName = `${packageImportPath
      .replace(';', '')
      .replace(/import\s+/, '')
      .split('.')
      .slice(0, -1)
      .join('.')}.${moduleClassName}`;
    const moduleClassNameJs = moduleClassName;
    const moduleImportNameJs = `${packageImportPath
      .replace(';', '')
      .replace(/import\s+/, '')
      .split('.')
      .slice(0, -1)
      .join('.')}.${moduleClassNameJs}`;
    return {
      exportedMethods,
      exportedModuleName,
      exportsConstants,
      moduleClassName,
      moduleClassNameJs,
      moduleImportName,
      moduleImportNameJs,
    };
  });
  return {
    androidMkPath,
    androidProjectName: makeAndroidProjectName(npmPackageName),
    buildTypes,
    cmakeListsPath,
    componentDescriptors,
    dependencyConfiguration,
    libraryName,
    modules: modulesWithImportNames,
    npmPackageName,
    packageImportPath,
    packageInstance,
    sourceDir,
  };
}
async function findManifest(folder) {
  const manifestPath = (
    await globProm(path.join('**', 'AndroidManifest.xml'), {
      cwd: folder,
      ignore: ['node_modules/**', '**/build/**', '**/debug/**', 'Examples/**', 'examples/**'],
    })
  )[0];
  return manifestPath ? path.join(folder, manifestPath) : null;
}
exports.findManifest = findManifest;
function globProm(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}
async function getAndroidPackageName(manifestPath) {
  const bgRed = '\x1b[41m';
  const dim = '\x1b[2m';
  const underline = '\x1b[4m';
  const reset = '\x1b[0m';
  const androidManifest = await readFile(manifestPath, 'utf8');
  const packageNameMatchArray = androidManifest.match(/package="(.+?)"/);
  if (!packageNameMatchArray || packageNameMatchArray.length === 0) {
    throw new Error(`Failed to build the app: No package name found. Found errors in ${underline}${dim}${manifestPath}`);
  }
  const packageName = packageNameMatchArray[1];
  if (!validateAndroidPackageName(packageName)) {
    console.warn(`Invalid application's package name "${bgRed}${packageName}${reset}" in 'AndroidManifest.xml'. Read guidelines for setting the package name here: ${underline}${dim}https://developer.android.com/studio/build/application-id`);
  }
  return packageName;
}
exports.getAndroidPackageName = getAndroidPackageName;
function validateAndroidPackageName(packageName) {
  return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName);
}
async function parseSourceFiles(folder) {
  const filePaths = await globProm('**/+(*.java|*.kt)', { cwd: folder });
  const files = await Promise.all(filePaths.map((filePath) => readFile(path.join(folder, filePath), 'utf8')));
  let packageDeclarationMatch = null;
  const moduleDeclarationMatches = [];
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
  const modules = moduleDeclarationMatches.map(({ contents: moduleContents, match: moduleDeclarationMatch }) => {
    var _a;
    const [, moduleClassName] = moduleDeclarationMatch;
    const exportedMethodMatches = (_a = moduleContents.match(ANDROID_METHOD_REGEX)) !== null && _a !== void 0 ? _a : [];
    const exportsConstants = /@Override\s+.*\s+getConstants\(\s*\)\s*{/m.test(moduleContents);
    const exportedMethods = exportedMethodMatches
      .map((raw) => {
        raw = raw.replace(/\s+/g, ' ');
        const isBlockingSynchronousMethod = /isBlockingSynchronousMethod\s*=\s*true/.test(raw.split(/\)/).find((split) => split.includes('@ReactMethod(')));
        raw = raw.split(/@[a-zA-Z]*\s+/).slice(-1)[0];
        const signature = raw.split(/\s*{/)[0];
        const [signatureBeforeParams, signatureFromParams = ''] = signature.split(/\(/);
        const signatureBeforeParamsSplit = signatureBeforeParams.split(/\s+/);
        const methodNameJava = signatureBeforeParamsSplit.slice(-1)[0];
        const returnType = signatureBeforeParamsSplit.slice(-2)[0];
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
    const exportedModuleName = getModuleName(moduleContents);
    return {
      exportedMethods,
      exportedModuleName,
      exportsConstants,
      moduleClassName,
    };
  });
  return {
    modules,
    packageClassName,
  };
}
function getModuleName(moduleContents) {
  var _a, _b;
  const getNameFunctionReturnValue = (_b = (_a = moduleContents.match(ANDROID_GET_NAME_FN_REGEX)) === null || _a === void 0 ? void 0 : _a[0].match(ANDROID_MODULE_NAME_REGEX)) === null || _b === void 0 ? void 0 : _b[0].trim();
  if (getNameFunctionReturnValue.startsWith(`"`)) return getNameFunctionReturnValue.replace(/"/g, '');
  const variableDefinitionLine = moduleContents.split('\n').find((line) => line.includes(`String ${getNameFunctionReturnValue}`));
  return variableDefinitionLine.split(`"`)[1];
}
function matchClassDeclarationForPackage(file) {
  const nativeModuleMatch = file.match(/class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*ReactPackage/);
  if (nativeModuleMatch) {
    return nativeModuleMatch;
  } else {
    return file.match(/class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*TurboReactPackage/);
  }
}
function matchClassDeclarationForModule(file) {
  return file.match(/class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*ReactContextBaseJavaModule/);
}
function makeAndroidProjectName(npmPackageName) {
  return npmPackageName.replace(/@/g, '').replace(/\//g, '_');
}
function findLibraryName(root, sourceDir) {
  var _a;
  const packageJsonPath = path.join(root, 'package.json');
  const buildGradlePath = path.join(sourceDir, 'build.gradle');
  const buildGradleKtsPath = path.join(sourceDir, 'build.gradle.kts');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if ((_a = packageJson.codegenConfig) === null || _a === void 0 ? void 0 : _a.name) {
      return packageJson.codegenConfig.name;
    }
  }
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
async function findComponentDescriptors(packageRoot) {
  const filepaths = await globProm('**/+(*.js|*.jsx|*.ts|*.tsx)', {
    cwd: packageRoot,
    nodir: true,
  });
  const contentsArr = await Promise.all(filepaths.map((filePath) => readFile(path.join(packageRoot, filePath), 'utf8')));
  const codegenComponent = contentsArr.map(extractComponentDescriptors).filter(Boolean);
  return Array.from(new Set(codegenComponent));
}
exports.findComponentDescriptors = findComponentDescriptors;
const CODEGEN_NATIVE_COMPONENT_REGEX = /codegenNativeComponent(<.*>)?\s*\(\s*["'`](\w+)["'`](,?[\s\S]+interfaceOnly:\s*(\w+))?/m;
function extractComponentDescriptors(contents) {
  const match = contents.match(CODEGEN_NATIVE_COMPONENT_REGEX);
  if (!((match === null || match === void 0 ? void 0 : match[4]) === 'true') && (match === null || match === void 0 ? void 0 : match[2])) {
    return `${match[2]}ComponentDescriptor`;
  }
  return null;
}
exports.extractComponentDescriptors = extractComponentDescriptors;
async function writeModulesJsonFile({ modules, outputModulesJsonPath }) {
  return await writeFile(outputModulesJsonPath, JSON.stringify(modules, null, 2), { encoding: 'utf-8' });
}
async function writePackagesJavaFile({ packages, outputPackagesJavaPath }) {
  const contents = [
    'package com.bridge;',
    '',
    'import com.facebook.react.ReactPackage;',
    '',
    '// Import all module packages',
    ...packages.map(({ packageImportPath }) => packageImportPath),
    '',
    '// Import all module classes',
    ...packages.flatMap(({ modules }) => modules.map((m) => `import ${m.moduleImportName};`)),
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
    ...packages.map(({ packageInstance }, index) => `      ${packageInstance}${index === packages.length - 1 ? '' : ','}`),
    '    );',
    '',
    '    // Register each module class so that we can lazily access modules upon',
    '    // first function call',
    ...packages.flatMap(({ modules }) => modules.map((m) => `    moduleClasses.put("${m.exportedModuleName}", ${m.moduleClassName}.class);`)),
    '',
    '  }',
    '}',
    '',
  ].join('\n');
  return await writeFile(outputPackagesJavaPath, contents, {
    encoding: 'utf-8',
  });
}
async function writeIncludeGradleFile({ projectNames, outputIncludeGradlePath }) {
  const contents = ['dependencies {', 'implementation project(":bridge")', ...projectNames.map((projectName) => `implementation project(":${projectName}")`), '}'].join('\n');
  return await writeFile(outputIncludeGradlePath, contents, {
    encoding: 'utf-8',
  });
}
async function writeSettingsGradleFile(projectDir) {
  const settingsGradlePath = projectDir + '/platforms/android/settings.gradle';
  const settingsGradlePatch = `// Mark open-native patch
def reactNativePkgJson = new File(["node", "--print", "require.resolve('open-native/package.json')"].execute(null, rootDir).text.trim())
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
  if (currentSettingsGradle.includes('Mark open-native patch')) return;
  return await writeFile(settingsGradlePath, [currentSettingsGradle, settingsGradlePatch].join('\n'), {
    encoding: 'utf-8',
  });
}
async function writeModuleMapFile({ moduleMap, outputModuleMapPath }) {
  return await writeFile(outputModuleMapPath, JSON.stringify(moduleMap, null, 2), {
    encoding: 'utf-8',
  });
}
const ANDROID_METHOD_REGEX = /@ReactMethod+((.|\n)*?) {/gm;
const ANDROID_GET_NAME_FN_REGEX = /public String getName\(\)[\s\S]*?\{[^}]*\}/gm;
const ANDROID_MODULE_NAME_REGEX = /(?<=return ).*(?=;)/gm;
function parseJavaTypeToEnum(javaType) {
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
var RNJavaSerialisableType;
(function (RNJavaSerialisableType) {
  RNJavaSerialisableType[(RNJavaSerialisableType['other'] = 0)] = 'other';
  RNJavaSerialisableType[(RNJavaSerialisableType['void'] = 1)] = 'void';
  RNJavaSerialisableType[(RNJavaSerialisableType['string'] = 2)] = 'string';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullString'] = 3)] = 'nonnullString';
  RNJavaSerialisableType[(RNJavaSerialisableType['boolean'] = 4)] = 'boolean';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullBoolean'] = 5)] = 'nonnullBoolean';
  RNJavaSerialisableType[(RNJavaSerialisableType['int'] = 6)] = 'int';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullInt'] = 7)] = 'nonnullInt';
  RNJavaSerialisableType[(RNJavaSerialisableType['double'] = 8)] = 'double';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullDouble'] = 9)] = 'nonnullDouble';
  RNJavaSerialisableType[(RNJavaSerialisableType['float'] = 10)] = 'float';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullFloat'] = 11)] = 'nonnullFloat';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullObject'] = 12)] = 'nonnullObject';
  RNJavaSerialisableType[(RNJavaSerialisableType['object'] = 13)] = 'object';
  RNJavaSerialisableType[(RNJavaSerialisableType['array'] = 14)] = 'array';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullArray'] = 15)] = 'nonnullArray';
  RNJavaSerialisableType[(RNJavaSerialisableType['Callback'] = 16)] = 'Callback';
  RNJavaSerialisableType[(RNJavaSerialisableType['nonnullCallback'] = 17)] = 'nonnullCallback';
  RNJavaSerialisableType[(RNJavaSerialisableType['Promise'] = 18)] = 'Promise';
})(RNJavaSerialisableType || (RNJavaSerialisableType = {}));
