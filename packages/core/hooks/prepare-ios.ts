import * as cp from 'child_process';
import * as fs from 'fs';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import * as path from 'path';
import { promisify } from 'util';

const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const logPrefix = '[@open-native/core/hooks/prepare-ios.js]';

/**
 * Given a list of dependencies, autolinks any podspecs found within them, using
 * the React Native Community CLI search rules.
 * @param {object} args
 * @param args.dependencies The names of the npm dependencies to examine for
 *   autolinking.
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved).
 * @param args.outputHeaderPath An absolute path to output the header to.
 * @param args.outputPodfilePath An absolute path to output the Podfile to.
 * @param args.outputPodspecPath An absolute path to output the podspec to.
 * @param args.outputModuleMapPath An absolute path to output the module map to.
 *   (Just a JSON file. Not to be confused with a clang module.modulemap file).
 * @returns a list of package names in which podspecs were found and autolinked.
 */
export async function autolinkIos({
  packageDir,
  dependencies,
  projectDir,
  outputHeaderPath,
  outputPodfilePath,
  outputPodspecPath,
  outputModuleMapPath,
}: {
  packageDir: string;
  dependencies: string[];
  projectDir: string;
  outputHeaderPath: string;
  outputPodfilePath: string;
  outputPodspecPath: string;
  outputModuleMapPath: string;
}) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageDir, '/package.json'), {
      encoding: 'utf8',
    })
  );

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

  const moduleNamesToMethodDescriptionsCombined = autolinkingInfo.reduce(
    (acc, { moduleNamesToMethodDescriptions }) => {
      return Object.assign(acc, moduleNamesToMethodDescriptions);
    },
    {}
  );

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

/**
 * @param {object} args
 * @param args.ownPackageName The name for the package holding this hook,
 *   e.g. 'open-native', which holds core modules rather than
 *   community modules. It'll look for the podspecs for core by a special path.
 * @param args.packageName The package name, e.g. 'react-native-module-test'.
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved). In other words, the directory holding your app's
 *   node_modules.
 */
async function mapPackageNameToAutolinkingInfo({
  ownPackageName,
  packageName,
  projectDir,
}: {
  ownPackageName: string;
  packageName: string;
  projectDir: string;
}) {
  const packagePath = path.dirname(
    require.resolve(`${packageName}/package.json`, { paths: [projectDir] })
  );

  const podspecs = await globProm(
    packageName === ownPackageName
      ? // This glob will include the podspecs of any RN core modules, which for
        // now is just one.
        'platforms/ios/React-RCTLinking.podspec'
      : '*.podspec',
    {
      cwd: packagePath,
      absolute: true,
    }
  );
  if (podspecs.length === 0) {
    return null;
  }

  const { podspecFileName, podspecFilePath } = resolvePodspecFilePath({
    packageName,
    packagePath,
    podspecs,
  });

  const { stdout: podspecContents } = await execFile('pod', [
    'ipc',
    'spec',
    podspecFilePath,
  ]);

  /**
   * These are the typings (that we're interested in), assuming a valid podspec.
   * We'll handle it in a failsafe manner.
   * TODO: Handle subspecs. Can run the following as a test case:
   * ipc spec pod packages/core/platforms/ios/React-Core.podspec
   */
  const podspecParsed: {
    name?: string;
    source_files?: string | string[];
    ios?: { source_files?: string | string[] };
    header_dir?: string;
  } = JSON.parse(podspecContents);

  // The other platforms are 'osx', 'macos', 'tvos', and 'watchos'.
  const {
    name: podspecName = packageName,
    source_files: commonSourceFiles = [],
    ios: { source_files: iosSourceFiles } = { source_files: [] },
  } = podspecParsed;

  if (!podspecParsed.name) {
    console.warn(
      `${logPrefix} Podspec "${podspecFileName}" for npm package "${packageName}" did not specify a name, so using "${packageName}" instead.`
    );
  }

  const sourceFilePaths = await getSourceFilePaths({
    commonSourceFiles,
    iosSourceFiles,
    cwd: path.dirname(podspecFilePath),
  });

  // In a complicated pod setup, e.g. with subspecs, there may be special cases
  // to handle. In practice, this is redundant for core modules (we don't
  // augment the header at present), but it's good to be prepared for a future
  // change (e.g. if we stopped manually writing out the headers).
  const clangModuleNameSpecialCases = {
    // Change:
    //   #import <React_RCTLinking/RCTLinkingManager.h>
    // ... to:
    //   #import <React/RCTLinkingManager.h>
    // I'm not sure whether both technically work, but the RN codebase seems to
    // use the latter, and I can't deny that it looks prettier.
    'React-RCTLinking': 'React',
  };

  // We replace hyphens with underscores as per Clang rules:
  //
  // > Names of Clang Modules are limited to be C99ext-identifiers. This
  // > means that they can only contain alphanumeric characters and
  // > underscores, and cannot begin with a number.
  // https://blog.cocoapods.org/Pod-Authors-Guide-to-CocoaPods-Frameworks/
  //
  // I believe that underscores are enforced when use_frameworks! is on,
  // though I don't know whether, conversely, hyphens are allowed when it's
  // off. This is just from my experience making this Cocoapod:
  // https://github.com/shirakaba/mecab-ko#swift-invocation

  const clangModuleName =
    clangModuleNameSpecialCases[podspecName] ||
    podspecParsed.header_dir ||
    podspecName.replace(/-/g, '_');
  const commentIdentifyingPodspec = `package: ${packageName}; podspec: ${podspecFileName}`;
  const podfileEntry = `pod '${podspecName}', path: "${podspecFilePath}"`;

  const sourceFileInfoArr = await Promise.all(
    sourceFilePaths.map(async (sourceFilePath) => {
      const sourceFileContents = await readFile(sourceFilePath, {
        encoding: 'utf8',
      });
      const sourceFileName = path.basename(sourceFilePath);

      // TODO: We should ideally strip comments before running any Regex.

      const { interfaceDecl, moduleNamesToMethodDescriptions } =
        extractInterfaces(sourceFileContents);

      console.log(
        `!! working out importDecl, given clangModuleName "${clangModuleName}"; sourceFilePath "${sourceFilePath}"`
      );

      // FIXME: this is a lazy, provisional trick to get the import declaration.
      // We assume that the source file is a .m file and that it declares its
      // classes in a file with the same name but a .h extension (and woe betide
      // us if they declare the class only in the .m file). This is
      // conventionally a safe assumption, but you just know some packages out
      // there will do things differently to make life hard for us.
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
    // A comment to write into the header to indicate where the interfaces that
    // we're about to extract came from.
    `// START: ${commentIdentifyingPodspec}`,
    ...sourceFileInfoArr
      // Filter only the source files that had some interfaces to write out.
      .filter((x) => x.interfaceDecl)
      .map((x) => {
        return [`// ${x.sourceFileName}`, x.interfaceDecl].join('\n');
      }),
    `// END: ${commentIdentifyingPodspec}`,
  ].join('\n');

  // For core modules, we've already manually written out the interfaces and
  // they're already being included, so we only need the
  // moduleNamesToMethodDescriptions.
  const isCoreModule = packageName === ownPackageName;

  return {
    clangModuleName,
    headerEntry: isCoreModule ? '' : headerEntry,
    importDecl: isCoreModule
      ? ''
      : sourceFileInfoArr.map(({ importDecl }) => importDecl).join('\n'),
    moduleNamesToMethodDescriptions:
      sourceFileInfoArr.reduce<ModuleNamesToMethodDescriptions>(
        (acc, { moduleNamesToMethodDescriptions }) =>
          Object.assign(acc, moduleNamesToMethodDescriptions),
        {}
      ),
    packageName,
    podfileEntry,
    podspecName,
  };
}

/**
 * Resolve the appropriate podspec using the React Native Community CLI rules.
 * @param {object} args
 * @param args.packageName The package name, e.g. 'react-native-module-test'.
 * @param args.packagePath The absolute path to the package, e.g.
 *   '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test'
 * @param args.podspecs An array of absolute paths to podspecs.
 */
function resolvePodspecFilePath({
  packageName,
  packagePath,
  podspecs,
}: {
  packageName: string;
  packagePath: string;
  podspecs: string[];
}) {
  const packagePodspec = path.join(packageName, `${packagePath}.podspec`);

  // If there are multiple podspecs, prefer the podspec named after the package
  // otherwise, just take the first match (all of this is consistent with how
  // the React Native Community CLI works).
  const resolvedPodspecPath =
    podspecs.find((podspec) => podspec === packagePodspec) || podspecs[0];

  return {
    podspecFileName: path.basename(resolvedPodspecPath),
    podspecFilePath: resolvedPodspecPath,
  };
}

/**
 * Build a unique-membered array of source files referenced by a podspec.
 * @param {object} args
 * @param args.commonSourceFiles The `source_files` value from the podspec.
 * @param args.iosSourceFiles The `ios.source_files` from the podspec.
 * @param args.packagePath The cwd to search for source file paths relative to.
 *   Should be the path to the directory containing the podspec.
 */
async function getSourceFilePaths({
  commonSourceFiles,
  iosSourceFiles,
  cwd,
}: {
  commonSourceFiles: string | string[];
  iosSourceFiles: string | string[];
  cwd: string;
}) {
  // Normalise to an array, treating empty-string as an empty array.
  const commonSourceFilesArr = commonSourceFiles
    ? Array.isArray(commonSourceFiles)
      ? commonSourceFiles
      : [commonSourceFiles]
    : [];
  const iosSourceFilesArr = iosSourceFiles
    ? Array.isArray(iosSourceFiles)
      ? iosSourceFiles
      : [iosSourceFiles]
    : [];

  // Take all the distinct patterns.
  const platformSourceFilesArr = [
    ...new Set([...commonSourceFilesArr, ...iosSourceFilesArr]),
  ];

  const sourceFilePathsArrays = await Promise.all(
    platformSourceFilesArr.map(
      async (pattern) => await globProm(pattern, { cwd, absolute: true })
    )
  );

  /**
   * Look just for Obj-C and Obj-C++ implementation files, ignoring headers.
   * @example
   * [
   *   '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/ios/RNTestModule.m'
   * ]
   */
  const sourceFilePaths = [...new Set(sourceFilePathsArrays.flat(1))].filter(
    (sourceFilePath) => /\.mm?$/.test(sourceFilePath)
  );

  return sourceFilePaths;
}

function globProm(pattern: string, options: IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}

/**
 * Extracts interfaces representing the methods added to any RCTBridgeModule by
 * macros (e.g. RCT_EXPORT_METHOD).
 */
function extractInterfaces(sourceCode: string) {
  /**
   * A record of JS bridge module names to method descriptions.
   * @example
   * {
   *    RNTestModule: [
   *      {
   *        exportedName: 'show',
   *        jsName: 'showWithRejecter',
   *        selector: 'show:withRejecter:',
   *        signature: '- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;',
   *        types: ['void', 'RCTPromiseResolveBlock', 'RCTPromiseRejectBlock'],
   *      }
   *    ]
   * }
   */
  const moduleNamesToMethodDescriptions = [
    ...sourceCode.matchAll(
      /\s*@implementation\s+([A-z0-9$]+)\s+(?:.|[\r\n])*?@end/gm
    ),
  ].reduce<ModuleNamesToMethodDescriptions>((acc, matches) => {
    const [fullMatch, objcClassName] = matches;
    if (!objcClassName) {
      return acc;
    }

    const exportedModuleName = (
      extractBridgeModuleAliasedName(fullMatch) || objcClassName
    ).replace(/^RCT/, '');
    if (!exportedModuleName) {
      return acc;
    }

    /**
     * Extract the signatures of any methods registered using RCT_REMAP_METHOD.
     * @example
     * ['- (void)showWithRemappedName:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject']
     */
    const remappedMethods = [
      ...fullMatch.matchAll(/^\s*RCT_REMAP_METHOD\((.|[\r\n])*?\)*?\{/gm),
    ].map((match) => {
      const [
        ,
        /** @example 'showWithRemappedName , show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromMethodName,
      ] = match[0].split(/RCT_REMAP_METHOD\(\s*/);

      const [
        /** @example 'showWithRemappedName' */
        methodRemappedName,
        /** @example ' show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromUnmappedMethodName,
      ] = fromMethodName.split(/\s*,/);

      /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject' */
      const methodUnmappedNameAndArgs = fromUnmappedMethodName
        .split(')')
        .slice(0, -1)
        .join(')');

      return parseRctExportMethodContents(
        methodUnmappedNameAndArgs,
        methodRemappedName.trim()
      );
    });

    /**
     * Extract the signatures of any methods registered using RCT_EXPORT_METHOD.
     * @example
     * ['- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject']
     */
    const exportedMethods = [
      ...fullMatch.matchAll(/^\s*RCT_EXPORT_METHOD\((.|[\r\n])*?\)*\{/gm),
    ].map((match) => {
      const [
        ,
        /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromMethodName,
      ] = match[0].split(/RCT_EXPORT_METHOD\(\s*/);

      /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject' */
      const methodNameAndArgs = fromMethodName
        .split(')')
        .slice(0, -1)
        .join(')');
      const methodName = methodNameAndArgs.split(':')[0].trim();
      return parseRctExportMethodContents(methodNameAndArgs, methodName);
    });

    const allMethods = [...remappedMethods, ...exportedMethods];

    if (!allMethods.length) {
      console.warn(
        `${logPrefix} Unable to extract any methods from RCTBridgeModule named "${exportedModuleName}".`
      );
    }
    const exportsConstants =
      /\s+-\s+\(NSDictionary\s?\*\s?\)constantsToExport\s+{/.test(fullMatch);
    const hasMethodQueue = fullMatch.includes('methodQueue');

    acc[exportedModuleName] = {
      jsName: objcClassName,
      exportsConstants,
      hasMethodQueue,
      methods: allMethods,
    };

    return acc;
  }, {});

  /**
   * For each module name, form an interface from the extracted method
   * signatures. Concatenate the resulting array of interfaces.
   * @example
   * @interface RNTestModule1
   *  - (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;
   * @end
   *
   * @interface RNTestModule2
   *  - (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;
   * @end
   */
  const interfaceDecl = Object.keys(moduleNamesToMethodDescriptions)
    .map((exportedModuleName) => {
      const { jsName, methods } =
        moduleNamesToMethodDescriptions[exportedModuleName];

      return !methods || methods.length === 0
        ? ''
        : [
            `@interface ${jsName} (TNS${jsName})`,
            methods.map((record) => record.signature).join('\n\n'),
            '@end',
          ].join('\n');
    })
    .join('\n\n');

  return {
    interfaceDecl,
    moduleNamesToMethodDescriptions,
  };
}

const ObjCMethodParamMatches = /:\((.|[\r\n])*?\).*?[a-zA-Z0-9]+/g;

/**
 * Parse the contents passed into RCT_EXPORT_METHOD or RCT_REMAP_METHOD.
 * @param contents The whole string between the macro's brackets.
 * @param exportedName The name exported to React Native consumers.
 *   - For RCT_EXPORT_METHOD, this is the portion of the method signature before
 *     the first colon (not including the return type).
 *   - For RCT_REMAP_METHOD, this is the text leading up to the comma.
 */
function parseRctExportMethodContents(contents: string, remappedName?: string) {
  /**
   * The Obj-C method signature, with all unnecessary whitespace removed.
   * @example '- (void)exportedName:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject'
   */
  const signature = `- (void)${contents
    .trim()
    .replace(/\s+/g, ' ') // Standardise all whitespace to a single space
    .replace(/\s?\*\s?/g, '*') // Collapse (NSString *) or similar to (NSString*)
    .replace(/\s*:\s*/g, ':')};`;

  /**
   * The Obj-C selector.
   * @example 'exportedName:withRejecter:'
   */
  const selector = signature
    .split('- (void)')[1]
    .replace(ObjCMethodParamMatches, '')
    .replace(';', '');
  /**
   * The sanitised method name that NativeScript exposes to JS.
   * @example 'exportedNameWithRejecter'
   */
  const jsName = convertObjcSelectorToJsName(selector);

  /**
   * Everything between brackets in the method signature.
   * @example ["void", "RCTPromiseResolveBlock", "RCTPromiseRejectBlock"]
   */
  const types = [...signature.matchAll(/\(.*?\)/g)].map((match) =>
    match[0].replace(/[()]/g, '')
  );

  const methodName = contents.split(':')[0].trim();

  /**
   * The method name that would be exposed to React Native. These two macro
   * calls both give the following output:
   *
   * {
   *   "selector": "executeQuery:parameters:",
   *   "jsName": "executeQueryParameters",
   *   "methodName": "executeQuery",
   * }
   *
   * ... but their exportedName differs:
   *
   * RCT_EXPORT_METHOD(executeQuery:(NSString *)query parameters:(NSDictionary *)parameters)
   * { "exportedName": "executeQuery" }
   *
   * RCT_REMAP_METHOD(executeQueryWithParameters, executeQuery:(NSString *)query parameters:(NSDictionary *)parameters)
   * { "exportedName": "executeQueryWithParameters" }
   *
   * @example 'executeQueryWithParameters'
   */
  const exportedName = remappedName || methodName;

  return {
    exportedName,
    jsName,
    selector,
    signature,
    types,
  };
}

interface MethodDescription {
  exportedName: string;
  jsName: string;
  selector: string;
  signature: string;
  types: string[];
}

interface ModuleNamesToMethodDescriptions {
  [moduleName: string]: {
    jsName: string;
    exportsConstants: boolean;
    hasMethodQueue: boolean;
    methods: MethodDescription[];
  };
}

/**
 * Converts the Obj-C method selector into the JS-safe property name that the
 * NativeScript metadata generator would convert the selector into.
 * @param selector the Obj-C method selector, e.g. 'show:withRejecter:'
 * @example 'showWithRejecter'
 */
function convertObjcSelectorToJsName(selector: string): string {
  const tokens: string[] = selector.split(' ').filter((param) => param !== '');
  let jsName = tokens[0].trim();
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i].trim();
    tokens[i] = `${token[0].toUpperCase()}${token.slice(1)}`;
    jsName += tokens[i];
  }
  return jsName;
}

/**
 * Gets the aliased name for a bridge module if there is one.
 * @param classImplementation The source code for the bridge module's
 *   class implementation.
 * @returns The aliased name for the bridge module as a string, or undefined if
 *   no alias was registered (in which case, the Obj-C class name should be used
 *   for the bridge module as-is).
 */
function extractBridgeModuleAliasedName(
  classImplementation: string
): string | undefined {
  const exportModuleMatches = [
    ...classImplementation.matchAll(/RCT_EXPORT_MODULE\((.*)\)/gm),
  ];
  const exportModuleNoLoadMatches = [
    ...classImplementation.matchAll(/RCT_EXPORT_MODULE_NO_LOAD\((.*)\)/gm),
  ];
  const exportPreRegisteredModuleNoLoadMatches = [
    ...classImplementation.matchAll(
      /RCT_EXPORT_PRE_REGISTERED_MODULE\((.*)\)/gm
    ),
  ];

  return (
    exportModuleMatches[0]?.[1] ||
    exportModuleNoLoadMatches[0]?.[1] ||
    exportPreRegisteredModuleNoLoadMatches[0]?.[1]
  );
}

/**
 *
 * @param {object} args
 * @param args.autolinkedDeps podfile entries for each React Native dependency
 *   to be autolinked.
 * @param args.outputPodfilePath An absolute path to output the Podfile to.
 * @returns A Promise to write the podfile into the specified location.
 */
async function writePodfile({
  autolinkedDeps,
  outputPodfilePath,
}: {
  autolinkedDeps: string[];
  outputPodfilePath: string;
}) {
  const reactDeps = [
    `pod 'ReactCommon', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/ReactCommon.podspec")`,
    `pod 'React-Core', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/React-Core.podspec")`,
    `pod 'React-RCTLinking', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/React-RCTLinking.podspec")`,
    `pod 'React', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/React.podspec")`,
    `pod 'RCTRequired', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/RCTRequired.podspec")`,
    `pod 'FBReactNativeSpec', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/FBReactNativeSpec.podspec")`,
    `pod 'FBLazyVector', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/FBLazyVector.podspec")`,
    `pod 'RCTTypeSafety', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/RCTTypeSafety.podspec")`,
  ];

  /**
   * Depending on React-Native-Podspecs allows us to include our RNPodspecs.h
   * file.
   */
  const reactNativePodspecsDep = `pod 'React-Native-Podspecs', path: File.join(File.dirname(\`node --print "require.resolve('@open-native/core/package.json')"\`), "platforms/ios/React-Native-Podspecs.podspec")`;

  const podfileContents = [
    '# This file will be updated automatically by hooks/before-prepareNativeApp.js.',
    "platform :ios, '12.4'",
    '',
    ...reactDeps,
    reactNativePodspecsDep,
    /**
     * NativeScript doesn't auto-link React Native modules, so here we add a
     * dependency on each React Native podspec we found during our search.
     */
    ...autolinkedDeps,
  ].join('\n');

  return await writeFile(outputPodfilePath, podfileContents, {
    encoding: 'utf-8',
  });
}

/**
 * @param {object} args
 * @param args.podspecNames the names of each dependency to add to the podspec.
 * @param args.outputPodspecPath An absolute path to output the podspec to.
 * @returns A Promise to write the podspec into the specified location.
 */
async function writePodspecfile({
  podspecNames,
  outputPodspecPath,
}: {
  podspecNames: string[];
  outputPodspecPath: string;
}) {
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
    `  s.source       = { :git => "https://github.com/OpenNative/open-native.git", :tag => "v#{s.version}" }`,
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

/**
 * @param {object} args
 * @param args.headerEntries Sections of the header file to be filled in.
 * @param args.outputHeaderPath An absolute path to output the header to.
 * @returns A Promise to write the header file into the specified location.
 */
async function writeHeaderFile({
  importDecls,
  headerEntries,
  outputHeaderPath,
}: {
  importDecls: string[];
  headerEntries: string[];
  outputHeaderPath: string;
}) {
  const RNPodspecsInterface = [
    '// START: react-native-podspecs placeholder interface',
    '@interface RNPodspecs: NSObject',
    '@end',
    '// END: react-native-podspecs placeholder interface',
  ].join('\n');

  // The core modules will return empty headerEntries and importDecls, so we
  // filter them out for neatness.
  const header = [
    '// This file will be updated automatically by hooks/before-prepareNativeApp.js.',
    '#import <React/RCTBridgeModule.h>',
    '#import <React/RCTEventEmitter.h>',
    importDecls.filter((importDecl) => importDecl).join('\n'),
    '',
    headerEntries.filter((headerEntry) => headerEntry).join('\n\n'),
    '',
    RNPodspecsInterface,
    '',
  ].join('\n');

  return await writeFile(outputHeaderPath, header, { encoding: 'utf-8' });
}

/**
 * @param {object} args
 * @param args.moduleNamesToMethodDescriptions A record of JS bridge module
 * names to method descriptions, e.g.:
 * {
 *    RNTestModule: [
 *      {
 *        name: 'show',
 *        methodTypes: ['void', 'RCTPromiseResolveBlock', 'RCTPromiseRejectBlock'],
 *        signature: '- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;',
 *      }
 *    ]
 * }
 * @param args.outputModuleMapPath An absolute path to output the module map to.
 * @returns A Promise to write the module map file into the specified location.
 */
async function writeModuleMapFile({
  moduleNamesToMethodDescriptions,
  outputModuleMapPath,
}: {
  moduleNamesToMethodDescriptions: ModuleNamesToMethodDescriptions;
  outputModuleMapPath: string;
}) {
  const moduleNamesToMethodDescriptionsMinimal = Object.keys(
    moduleNamesToMethodDescriptions
  ).reduce<ModuleNamesToMethodDescriptionsMinimal>(
    (acc, exportedModuleName) => {
      const { exportsConstants, methods, jsName, hasMethodQueue } =
        moduleNamesToMethodDescriptions[exportedModuleName];

      acc[exportedModuleName] = {
        j: jsName,
        e: exportsConstants,
        mq: hasMethodQueue,
        m: methods.reduce<MethodDescriptionsMinimal>(
          (innerAcc, methodDescription) => {
            const { exportedName, jsName, types } = methodDescription;
            innerAcc[exportedName] = {
              j: jsName,
              t: types.map((paramType) => parseObjcTypeToEnum(paramType)),
            };
            return innerAcc;
          },
          {}
        ),
      };

      return acc;
    },
    {}
  );

  return await writeFile(
    outputModuleMapPath,
    JSON.stringify(moduleNamesToMethodDescriptionsMinimal, null, 0) + '\n',
    { encoding: 'utf-8' }
  );
}

interface MethodDescriptionsMinimal {
  /**
   * The method name specified in RCT_EXPORT_METHOD() or RCT_REMAP_METHOD().
   * @example For RCT_EXPORT_METHOD(show), it would be 'show'.
   */
  [exportedMethodName: string]: {
    /**
     * The equivalent method name once mapped into a JS-friendly property by the
     * NativeScript metadata generator.
     * @example 'showWithRejecter'
     */
    j: string;
    /**
     * The types (first the return type, followed by each of the params) mapped
     * to an enum.
     * @example [1, 14, 15]
     */
    t: RNObjcSerialisableType[];
  };
}

interface ModuleNamesToMethodDescriptionsMinimal {
  [exportedModuleName: string]: {
    /**
     * The Obj-C class name for the module, mapped into a JS-friendly name for
     * access from NativeScript. As I'm unclear NativeScript does any remapping
     * of classnames, it's simply the same as the Obj-C name.
     * @example 'RCTLinkingManager', given the exported name 'LinkingManager'
     */
    j: string;
    /**
     * Whether the module exports any constants.
     * @example true
     */
    e: boolean;
    /**
     * The methods exported by the module.
     */
    m: MethodDescriptionsMinimal;
    /**
     * Whether the module defines it's own methodQueue.
     */
    mq: boolean;
  };
}

function parseObjcTypeToEnum(objcType: string): RNObjcSerialisableType {
  // Search for nullability annotations as per:
  // https://developer.apple.com/swift/blog/?id=25:
  // We'll accordingly search for:
  // 1) When 'nonnull' immediately follows the opening bracket for the arg;
  // 2) If there's a '_Nonnull' token anywhere within the type.
  // We won't bother distinguishing params that have a name that includes the
  // text '_Nonnull'. Hopefully that never comes up.
  //
  // We don't bother searching for nullable annotations, because that's our
  // default nullability for each type that supports nullability.
  const nonnull =
    /^nonnull\s+/.test(objcType.trim()) ||
    objcType.toLowerCase().includes('_Nonnull');

  const splitBeforeGeneric = objcType.split('<')[0];

  if (splitBeforeGeneric.includes('NSString')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullString
      : RNObjcSerialisableType.string;
  }
  if (splitBeforeGeneric.includes('NSNumber')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullNumber
      : RNObjcSerialisableType.number;
  }
  if (splitBeforeGeneric.includes('NSDictionary')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullObject
      : RNObjcSerialisableType.object;
  }
  if (splitBeforeGeneric.includes('NSArray')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullArray
      : RNObjcSerialisableType.array;
  }

  switch (objcType) {
    case 'void': // This is only of relevance for parsing the return type.
      return RNObjcSerialisableType.void;
    case 'double':
    case 'float': // deprecated
    case 'CGFloat': // deprecated
    case 'NSInteger': // deprecated
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
    case 'int':
      return RNObjcSerialisableType.int;
    default:
      return RNObjcSerialisableType.other;
  }
}

// FIXME: need to figure out a proper pattern for importing this from its own
// package (but outside the hooks directory, which has its own tsconfig). For
// now, we'll just have to maintain an identical copy of this enum within the
// hook.
enum RNObjcSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // NSString*
  nonnullString, // nonnull NSString*
  boolean, // NSNumber* (bounded between 0 and 1, presumably)
  nonnullBoolean, // BOOL
  number, // NSNumber*
  nonnullNumber, // nonnull NSNumber*, double (and the deprecated float,
  // CGFloat, and NSInteger)
  int, // Not documented but is used by some modules, just int.
  array, // NSArray*
  nonnullArray, // nonnull NSArray*
  object, // NSDictionary*
  nonnullObject, // nonnull NSDictionary*
  RCTResponseSenderBlock,
  RCTResponseErrorBlock,
  RCTPromiseResolveBlock,
  RCTPromiseRejectBlock,
}
