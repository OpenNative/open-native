'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.autolinkIos = void 0;
const cp = require('child_process');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const util_1 = require('util');
const execFile = (0, util_1.promisify)(cp.execFile);
const readFile = (0, util_1.promisify)(fs.readFile);
const writeFile = (0, util_1.promisify)(fs.writeFile);
const logPrefix = '[open-native/hooks/prepare-ios.js]';
async function autolinkIos({ dependencies, projectDir, outputHeaderPath, outputPodfilePath, outputPodspecPath, outputModuleMapPath }) {
  // when used as standard hook in plugin:
  // const packageJson = JSON.parse(await readFile(path.resolve(__dirname, '../package.json'), {
  //     encoding: 'utf8',
  // }));
  // when used for improved local development:
  const packageJson = require('open-native/package.json');
  const autolinkingInfo = (
    await Promise.all(
      dependencies.map((packageName) =>
        mapPackageNameToAutolinkingInfo({
          ownPackageName: packageJson.name,
          packageName,
          projectDir,
        })
      )
    )
  )
    .filter((p) => !!p)
    .flat(1);
  const moduleNamesToMethodDescriptionsCombined = autolinkingInfo.reduce((acc, { moduleNamesToMethodDescriptions }) => {
    return Object.assign(acc, moduleNamesToMethodDescriptions);
  }, {});
  await Promise.all([
    await writeHeaderFile({
      importDecls: autolinkingInfo.map(({ importDecl }) => importDecl),
      headerEntries: autolinkingInfo.map(({ headerEntry }) => headerEntry),
      outputHeaderPath,
    }),
    await writePodfile({
      autolinkedDeps: autolinkingInfo.map(({ podfileEntry }) => podfileEntry),
      outputPodfilePath,
    }),
    await writePodspecfile({
      podspecNames: autolinkingInfo.map(({ podspecName }) => podspecName),
      outputPodspecPath,
    }),
    await writeModuleMapFile({
      moduleNamesToMethodDescriptions: moduleNamesToMethodDescriptionsCombined,
      outputModuleMapPath,
    }),
  ]);
  return autolinkingInfo.map(({ packageName }) => packageName);
}
exports.autolinkIos = autolinkIos;
async function mapPackageNameToAutolinkingInfo({ ownPackageName, packageName, projectDir }) {
  const packagePath = path.dirname(require.resolve(`${packageName}/package.json`, { paths: [projectDir] }));
  const podspecs = await globProm(packageName === ownPackageName ? 'platforms/ios/React-RCTLinking.podspec' : '*.podspec', {
    cwd: packagePath,
    absolute: true,
  });
  if (podspecs.length === 0) {
    return null;
  }
  const { podspecFileName, podspecFilePath } = resolvePodspecFilePath({
    packageName,
    packagePath,
    podspecs,
  });
  const { stdout: podspecContents } = await execFile('pod', ['ipc', 'spec', podspecFilePath]);
  const podspecParsed = JSON.parse(podspecContents);
  const { name: podspecName = packageName, source_files: commonSourceFiles = [], ios: { source_files: iosSourceFiles } = { source_files: [] } } = podspecParsed;
  if (!podspecParsed.name) {
    console.warn(`${logPrefix} Podspec "${podspecFileName}" for npm package "${packageName}" did not specify a name, so using "${packageName}" instead.`);
  }
  const sourceFilePaths = await getSourceFilePaths({
    commonSourceFiles,
    iosSourceFiles,
    cwd: path.dirname(podspecFilePath),
  });
  const clangModuleNameSpecialCases = {
    'React-RCTLinking': 'React',
  };
  const clangModuleName = clangModuleNameSpecialCases[podspecName] || podspecName.replace(/-/g, '_');
  const commentIdentifyingPodspec = `package: ${packageName}; podspec: ${podspecFileName}`;
  const podfileEntry = `pod '${podspecName}', path: "${podspecFilePath}"`;
  const sourceFileInfoArr = await Promise.all(
    sourceFilePaths.map(async (sourceFilePath) => {
      const sourceFileContents = await readFile(sourceFilePath, {
        encoding: 'utf8',
      });
      const sourceFileName = path.basename(sourceFilePath);
      const { interfaceDecl, moduleNamesToMethodDescriptions } = extractInterfaces(sourceFileContents);
      console.log(`!! working out importDecl, given clangModuleName "${clangModuleName}"; sourceFilePath "${sourceFilePath}"`);
      const headerFileName = sourceFileName.replace(/\.mm?$/, '');
      const importDecl = `#import <${clangModuleName}/${headerFileName}.h>`;
      return {
        interfaceDecl,
        sourceFileName,
        importDecl,
        moduleNamesToMethodDescriptions,
      };
    })
  );
  const headerEntry = [
    `// START: ${commentIdentifyingPodspec}`,
    ...sourceFileInfoArr
      .filter((x) => x.interfaceDecl)
      .map((x) => {
        return [`// ${x.sourceFileName}`, x.interfaceDecl].join('\n');
      }),
    `// END: ${commentIdentifyingPodspec}`,
  ].join('\n');
  const isCoreModule = packageName === ownPackageName;
  return {
    clangModuleName,
    headerEntry: isCoreModule ? '' : headerEntry,
    importDecl: isCoreModule ? '' : sourceFileInfoArr.map(({ importDecl }) => importDecl).join('\n'),
    moduleNamesToMethodDescriptions: sourceFileInfoArr.reduce((acc, { moduleNamesToMethodDescriptions }) => Object.assign(acc, moduleNamesToMethodDescriptions), {}),
    packageName,
    podfileEntry,
    podspecName,
  };
}
function resolvePodspecFilePath({ packageName, packagePath, podspecs }) {
  const packagePodspec = path.join(packageName, `${packagePath}.podspec`);
  const resolvedPodspecPath = podspecs.find((podspec) => podspec === packagePodspec) || podspecs[0];
  return {
    podspecFileName: path.basename(resolvedPodspecPath),
    podspecFilePath: resolvedPodspecPath,
  };
}
async function getSourceFilePaths({ commonSourceFiles, iosSourceFiles, cwd }) {
  const commonSourceFilesArr = commonSourceFiles ? (Array.isArray(commonSourceFiles) ? commonSourceFiles : [commonSourceFiles]) : [];
  const iosSourceFilesArr = iosSourceFiles ? (Array.isArray(iosSourceFiles) ? iosSourceFiles : [iosSourceFiles]) : [];
  const platformSourceFilesArr = [...new Set([...commonSourceFilesArr, ...iosSourceFilesArr])];
  const sourceFilePathsArrays = await Promise.all(platformSourceFilesArr.map(async (pattern) => await globProm(pattern, { cwd, absolute: true })));
  const sourceFilePaths = [...new Set(sourceFilePathsArrays.flat(1))].filter((sourceFilePath) => /\.mm?$/.test(sourceFilePath));
  return sourceFilePaths;
}
function globProm(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}
function extractInterfaces(sourceCode) {
  const moduleNamesToMethodDescriptions = [...sourceCode.matchAll(/\s*@implementation\s+([A-z0-9$]+)\s+(?:.|[\r\n])*?@end/gm)].reduce((acc, matches) => {
    const [fullMatch, objcClassName] = matches;
    if (!objcClassName) {
      return acc;
    }
    const exportedModuleName = (extractBridgeModuleAliasedName(fullMatch) || objcClassName).replace(/^RCT/, '');
    if (!exportedModuleName) {
      return acc;
    }
    const remappedMethods = [...fullMatch.matchAll(/\s*RCT_REMAP_METHOD\((.|[\r\n])*?\)*?\{$/gm)].map((match) => {
      const [, fromMethodName] = match[0].split(/RCT_REMAP_METHOD\(\s*/);
      const [methodRemappedName, fromUnmappedMethodName] = fromMethodName.split(/\s*,/);
      const methodUnmappedNameAndArgs = fromUnmappedMethodName.split(')').slice(0, -1).join(')');
      return parseRctExportMethodContents(methodUnmappedNameAndArgs, methodRemappedName.trim());
    });
    const exportedMethods = [...fullMatch.matchAll(/\s*RCT_EXPORT_METHOD\((.|[\r\n])*?\)*\{$/gm)].map((match) => {
      const [, fromMethodName] = match[0].split(/RCT_EXPORT_METHOD\(\s*/);
      const methodNameAndArgs = fromMethodName.split(')').slice(0, -1).join(')');
      const methodName = methodNameAndArgs.split(':')[0].trim();
      return parseRctExportMethodContents(methodNameAndArgs, methodName);
    });
    const allMethods = [...remappedMethods, ...exportedMethods];
    if (!allMethods.length) {
      console.warn(`${logPrefix} Unable to extract any methods from RCTBridgeModule named "${exportedModuleName}".`);
    }
    const exportsConstants = /\s+-\s+\(NSDictionary\s?\*\s?\)constantsToExport\s+{/.test(fullMatch);
    acc[exportedModuleName] = {
      jsName: objcClassName,
      exportsConstants,
      methods: allMethods,
    };
    return acc;
  }, {});
  const interfaceDecl = Object.keys(moduleNamesToMethodDescriptions)
    .map((exportedModuleName) => {
      const { jsName, methods } = moduleNamesToMethodDescriptions[exportedModuleName];
      return [`@interface ${jsName} (TNS${jsName})`, methods.map((record) => record.signature).join('\n\n'), '@end'].join('\n');
    })
    .join('\n\n');
  return {
    interfaceDecl,
    moduleNamesToMethodDescriptions,
  };
}
function parseRctExportMethodContents(contents, remappedName) {
  const signature = `- (void)${contents
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s?\*\s?/g, '*')
    .replace(/\s*:\s*/g, ':')};`;
  const params = signature.split('- (void)')[1].replace(';', '').split(' ');
  const selector = params.map((param) => param.split(':')[0]).join(':') + (signature.includes(':') ? ':' : '');
  const jsName = convertObjcSelectorToJsName(selector);
  const types = [...signature.matchAll(/\(.*?\)/g)].map((match) => match[0].replace(/[()]/g, ''));
  const methodName = contents.split(':')[0].trim();
  const exportedName = remappedName || methodName;
  return {
    exportedName,
    jsName,
    selector,
    signature,
    types,
  };
}
function convertObjcSelectorToJsName(selector) {
  const tokens = selector.split(':').filter((param) => param !== '');
  let jsName = tokens[0];
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    tokens[i] = `${token[0].toUpperCase()}${token.slice(1)}`;
    jsName += tokens[i];
  }
  return jsName;
}
function extractBridgeModuleAliasedName(classImplementation) {
  var _a, _b, _c;
  const exportModuleMatches = [...classImplementation.matchAll(/RCT_EXPORT_MODULE\((.*)\)/gm)];
  const exportModuleNoLoadMatches = [...classImplementation.matchAll(/RCT_EXPORT_MODULE_NO_LOAD\((.*)\)/gm)];
  const exportPreRegisteredModuleNoLoadMatches = [...classImplementation.matchAll(/RCT_EXPORT_PRE_REGISTERED_MODULE\((.*)\)/gm)];
  return ((_a = exportModuleMatches[0]) === null || _a === void 0 ? void 0 : _a[1]) || ((_b = exportModuleNoLoadMatches[0]) === null || _b === void 0 ? void 0 : _b[1]) || ((_c = exportPreRegisteredModuleNoLoadMatches[0]) === null || _c === void 0 ? void 0 : _c[1]);
}
async function writePodfile({ autolinkedDeps, outputPodfilePath }) {
  const reactDeps = [`pod 'React-Core', path: File.join(File.dirname(\`node --print "require.resolve('open-native/package.json')"\`), "platforms/ios/React-Core.podspec")`, `pod 'React-RCTLinking', path: File.join(File.dirname(\`node --print "require.resolve('open-native/package.json')"\`), "platforms/ios/React-RCTLinking.podspec")`, `pod 'React', path: File.join(File.dirname(\`node --print "require.resolve('open-native/package.json')"\`), "platforms/ios/React.podspec")`];
  const reactNativePodspecsDep = `pod 'React-Native-Podspecs', path: File.join(File.dirname(\`node --print "require.resolve('open-native/package.json')"\`), "platforms/ios/React-Native-Podspecs.podspec")`;
  const podfileContents = ['# This file will be updated automatically by hooks/before-prepareNativeApp.js.', "platform :ios, '12.4'", '', ...reactDeps, reactNativePodspecsDep, ...autolinkedDeps].join('\n');
  return await writeFile(outputPodfilePath, podfileContents, {
    encoding: 'utf-8',
  });
}
async function writePodspecfile({ podspecNames, outputPodspecPath }) {
  const podspecContents = [
    `# This file will be updated automatically by hooks/before-prepareNativeApp.js.`,
    `require 'json'`,
    ``,
    `package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))`,
    ``,
    `Pod::Spec.new do |s|`,
    `  s.name         = "React-Native-Podspecs"`,
    `  s.header_dir   = "ReactNativePodspecs"`,
    `  s.version      = package['version']`,
    `  s.summary      = package['description']`,
    `  s.license      = package['license']`,
    ``,
    `  s.authors      = package['author']`,
    `  s.homepage     = package['homepage']`,
    `  s.platforms    = { :ios => "12.4" }`,
    ``,
    `  s.source       = { :git => "https://github.com/ammarahm-ed/nativescript-magic-spells.git", :tag => "v#{s.version}" }`,
    `  s.source_files  = "lib_community/**/*.{h,m,mm,swift}"`,
    ``,
    `  s.dependency 'React-Core'`,
    ...podspecNames.map((name) => `  s.dependency '${name}'`),
    `end`,
    ``,
  ].join('\n');
  return await writeFile(outputPodspecPath, podspecContents, {
    encoding: 'utf-8',
  });
}
async function writeHeaderFile({ importDecls, headerEntries, outputHeaderPath }) {
  const RNPodspecsInterface = ['// START: react-native-podspecs placeholder interface', '@interface RNPodspecs: NSObject', '@end', '// END: react-native-podspecs placeholder interface'].join('\n');
  const header = ['// This file will be updated automatically by hooks/before-prepareNativeApp.js.', '#import <React/RCTBridgeModule.h>', '#import <React/RCTEventEmitter.h>', importDecls.filter((importDecl) => importDecl).join('\n'), '', headerEntries.filter((headerEntry) => headerEntry).join('\n\n'), '', RNPodspecsInterface, ''].join('\n');
  return await writeFile(outputHeaderPath, header, { encoding: 'utf-8' });
}
async function writeModuleMapFile({ moduleNamesToMethodDescriptions, outputModuleMapPath }) {
  const moduleNamesToMethodDescriptionsMinimal = Object.keys(moduleNamesToMethodDescriptions).reduce((acc, exportedModuleName) => {
    const { exportsConstants, methods, jsName } = moduleNamesToMethodDescriptions[exportedModuleName];
    acc[exportedModuleName] = {
      j: jsName,
      e: exportsConstants,
      m: methods.reduce((innerAcc, methodDescription) => {
        const { exportedName, jsName, types } = methodDescription;
        innerAcc[exportedName] = {
          j: jsName,
          t: types.map((paramType) => parseObjcTypeToEnum(paramType)),
        };
        return innerAcc;
      }, {}),
    };
    return acc;
  }, {});
  return await writeFile(outputModuleMapPath, JSON.stringify(moduleNamesToMethodDescriptionsMinimal, null, 2) + '\n', { encoding: 'utf-8' });
}
function parseObjcTypeToEnum(objcType) {
  const nonnull = /^nonnull\s+/.test(objcType.trim()) || objcType.toLowerCase().includes('_Nonnull');
  const splitBeforeGeneric = objcType.split('<')[0];
  if (splitBeforeGeneric.includes('NSString')) {
    return nonnull ? RNObjcSerialisableType.nonnullString : RNObjcSerialisableType.string;
  }
  if (splitBeforeGeneric.includes('NSNumber')) {
    return nonnull ? RNObjcSerialisableType.nonnullNumber : RNObjcSerialisableType.number;
  }
  if (splitBeforeGeneric.includes('NSDictionary')) {
    return nonnull ? RNObjcSerialisableType.nonnullObject : RNObjcSerialisableType.object;
  }
  if (splitBeforeGeneric.includes('NSArray')) {
    return nonnull ? RNObjcSerialisableType.nonnullArray : RNObjcSerialisableType.array;
  }
  switch (objcType) {
    case 'void':
      return RNObjcSerialisableType.void;
    case 'double':
    case 'float':
    case 'CGFloat':
    case 'NSInteger':
      return RNObjcSerialisableType.nonnullNumber;
    case 'BOOL':
      return RNObjcSerialisableType.nonnullBoolean;
    case 'RCTResponseSenderBlock':
      return RNObjcSerialisableType.RCTResponseSenderBlock;
    case 'RCTResponseErrorBlock':
      return RNObjcSerialisableType.RCTResponseErrorBlock;
    case 'RCTPromiseResolveBlock':
      return RNObjcSerialisableType.RCTPromiseResolveBlock;
    case 'RCTPromiseRejectBlock':
      return RNObjcSerialisableType.RCTPromiseRejectBlock;
    default:
      return RNObjcSerialisableType.other;
  }
}
var RNObjcSerialisableType;
(function (RNObjcSerialisableType) {
  RNObjcSerialisableType[(RNObjcSerialisableType['other'] = 0)] = 'other';
  RNObjcSerialisableType[(RNObjcSerialisableType['void'] = 1)] = 'void';
  RNObjcSerialisableType[(RNObjcSerialisableType['string'] = 2)] = 'string';
  RNObjcSerialisableType[(RNObjcSerialisableType['nonnullString'] = 3)] = 'nonnullString';
  RNObjcSerialisableType[(RNObjcSerialisableType['boolean'] = 4)] = 'boolean';
  RNObjcSerialisableType[(RNObjcSerialisableType['nonnullBoolean'] = 5)] = 'nonnullBoolean';
  RNObjcSerialisableType[(RNObjcSerialisableType['number'] = 6)] = 'number';
  RNObjcSerialisableType[(RNObjcSerialisableType['nonnullNumber'] = 7)] = 'nonnullNumber';
  RNObjcSerialisableType[(RNObjcSerialisableType['array'] = 8)] = 'array';
  RNObjcSerialisableType[(RNObjcSerialisableType['nonnullArray'] = 9)] = 'nonnullArray';
  RNObjcSerialisableType[(RNObjcSerialisableType['object'] = 10)] = 'object';
  RNObjcSerialisableType[(RNObjcSerialisableType['nonnullObject'] = 11)] = 'nonnullObject';
  RNObjcSerialisableType[(RNObjcSerialisableType['RCTResponseSenderBlock'] = 12)] = 'RCTResponseSenderBlock';
  RNObjcSerialisableType[(RNObjcSerialisableType['RCTResponseErrorBlock'] = 13)] = 'RCTResponseErrorBlock';
  RNObjcSerialisableType[(RNObjcSerialisableType['RCTPromiseResolveBlock'] = 14)] = 'RCTPromiseResolveBlock';
  RNObjcSerialisableType[(RNObjcSerialisableType['RCTPromiseRejectBlock'] = 15)] = 'RCTPromiseRejectBlock';
})(RNObjcSerialisableType || (RNObjcSerialisableType = {}));
