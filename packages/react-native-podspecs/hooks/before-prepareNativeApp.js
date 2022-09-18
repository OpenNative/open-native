const glob = require('glob');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const { promisify } = require('util');
const execFile = promisify(cp.execFile);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const logPrefix = '[react-native-podspecs/hooks/before-prepareNativeApp.js]';

/**
 * @param {import('./hookArgs').HookArgs} hookArgs
 */
module.exports = async function (hookArgs) {
  const {
    projectData,
    platformData: { platformNameLowerCase },
  } = hookArgs;

  // For now, we handle only iOS (as platforms other than iOS are experimental
  // on NativeScript). We might come back for macOS one day! :D
  if (platformNameLowerCase !== 'ios') {
    return;
  }

  console.log(`${logPrefix} Autolinking React Native podspecs for iOS...`);

  const { devDependencies, dependencies, ignoredDependencies, projectDir } =
    projectData;

  const ignoredDepsSet = new Set(ignoredDependencies);
  const depsArr = Object.keys({ ...devDependencies, ...dependencies }).filter(
    (key) => !ignoredDepsSet.has(key)
  );

  /**
   * @type {({
   *   packageName: string;
   *   headerEntry: string;
   *   podfileEntry: string;
   * }[]}
   */
  const autolinkingInfo = (
    await Promise.all(
      depsArr.map((packageName) =>
        mapPackageNameToAutolinkingInfo(packageName, projectDir)
      )
    )
  )
    .filter((p) => !!p)
    .flat(1);

  const green = '\x1b[32m';
  const reset = '\x1b[0m';
  autolinkingInfo.forEach(({ packageName }) =>
    console.log(`${logPrefix} Autolinked ${green}${packageName}${reset}!`)
  );

  // TODO: log out the names of all the packages we're autolinking.

  /**
   * @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-podspecs'
   */
  const reactNativePodspecsPackageDir = path.dirname(__dirname);

  await Promise.all([
    await writeHeaderFile({
      headerEntries: autolinkingInfo.map(({ headerEntry }) => headerEntry),
      reactNativePodspecsPackageDir,
    }),
    await writePodfile({
      autolinkedDeps: autolinkingInfo.map(({ podfileEntry }) => podfileEntry),
      reactNativePodspecsPackageDir,
    }),
  ]);

  console.log(
    `${logPrefix} ... Finished autolinking React Native podspecs for iOS.`
  );
};

/**
 * @param {string} packageName The package name, e.g.
 *   'react-native-module-test'
 * @param {string} projectDir The project directory (relative to which the
 *   package should be resolved).
 */
async function mapPackageNameToAutolinkingInfo(packageName, projectDir) {
  const packagePath = path.dirname(
    require.resolve(`${packageName}/package.json`, { paths: [projectDir] })
  );

  const podspecs = await globProm('*.podspec', {
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

  const { stdout: podspecContents } = await execFile('pod', [
    'ipc',
    'spec',
    podspecFilePath,
  ]);

  /**
   * These are the typings (that we're interested in), assuming a valid podspec.
   * We'll handle it in a failsafe manner.
   * @type {{
   *   name?: string;
   *   source_files?: string|string[];
   *   ios?: {
   *     source_files?: string|string[];
   *   };
   * }}
   */
  const podspecParsed = JSON.parse(podspecContents);

  // The other platforms are "osx", "macos", "tvos", and "watchos".
  const {
    name: podSpecName = packageName,
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
    packagePath,
  });

  return await Promise.all(
    sourceFilePaths.map(async (sourceFilePath) => {
      const sourceFileContents = await readFile(sourceFilePath, {
        encoding: 'utf8',
      });

      // TODO: We should ideally strip comments before running any Regex.

      const interfaces = extractInterfaces(sourceFileContents);

      const podfileEntry = `pod '${podSpecName}', path: "${podspecFilePath}"`;

      // A comment to write into the header to indicate where the interfaces
      // that we're about to extract came from.
      // const headerEntry = `// START: ${comment}\n${interfaces}`;
      const headerEntry = [
        `// START: ${packageName}/${podspecFileName}`,
        interfaces,
        `// END: ${packageName}/${podspecFileName}`,
      ].join('\n');

      return { packageName, headerEntry, podfileEntry };
    })
  );
}

/**
 * Resolve the appropriate podspec using the React Native Community CLI rules.
 * @param {object} args
 * @param {string} args.packageName The package name, e.g.
 *   'react-native-module-test'
 * @param {string} args.packagePath The absolute path to the package, e.g.
 *   '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test'
 * @param {string[]} args.podspecs An array of absolute paths to podspecs.
 */
function resolvePodspecFilePath({ packageName, packagePath, podspecs }) {
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
 * @param {string|string[]} args.commonSourceFiles The `source_files` value from
 *   the podspec.
 * @param {string|string[]} args.iosSourceFiles The `ios.source_files` from the
 *   podspec.
 * @param {string} args.packagePath The absolute path to the package, e.g.
 *   '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test'
 */
async function getSourceFilePaths({
  commonSourceFiles,
  iosSourceFiles,
  packagePath,
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
      async (pattern) =>
        await globProm(pattern, { cwd: packagePath, absolute: true })
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

/**
 * @param {string} pattern
 * @param {import('glob').IOptions} options
 * @returns {Promise<string[]>}
 */
function globProm(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}

/**
 * Extracts interfaces representing the methods added to any RCTBridgeModule by
 * macros (e.g. RCT_EXPORT_METHOD).
 * @param {string} sourceCode
 */
function extractInterfaces(sourceCode) {
  /**
   * A record of JS bridge module names to method signatures.
   * @example
   * {
   *    RNTestModule: [
   *      '(void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;'
   *    ]
   * }
   */
  const moduleNamesToMethods = [
    ...sourceCode.matchAll(
      /\s*@implementation\s+([A-z0-9$]+)\s+(?:.|[\r\n])*?@end/gm
    ),
  ].reduce((acc, matches) => {
    const [fullMatch, objcClassName] = matches;
    if (!objcClassName) {
      return acc;
    }

    const jsModuleName =
      extractBridgeModuleAliasedName(fullMatch) || objcClassName;
    if (!jsModuleName) {
      return acc;
    }

    /**
     * Extract the signatures of any methods registered using RCT_REMAP_METHOD.
     * @example
     * ['(void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;']
     */
    const remappedMethods = [
      ...fullMatch.matchAll(/\s*RCT_REMAP_METHOD\((.|[\r\n])*?\)*?\{$/gm),
    ].map((match) => {
      const [, fromMethodName] = match[0].split(/RCT_REMAP_METHOD\(\s*/);
      const [methodName, afterMethodName] = fromMethodName.split(/\s*,/);
      const methodArgs = afterMethodName.split(')').slice(0, -1).join(')');

      return `- (void)${methodName.trim()}${methodArgs
        .trim()
        .split(/\s+/)
        .join('\n')};`;
    });

    /**
     * Extract the signatures of any methods registered using RCT_EXPORT_METHOD.
     * @example
     * ['(void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;']
     */
    const exportedMethods = [
      ...fullMatch.matchAll(/\s*RCT_EXPORT_METHOD\((.|[\r\n])*?\)*\{$/gm),
    ].map((match) => {
      const [, macroContents] = match[0].split(/RCT_EXPORT_METHOD\(\s*/);
      const methodArgs = macroContents.split(')').slice(0, -1).join(')');

      return `- (void)${methodArgs.trim().split(/\s+/).join('\n')};`;
    });

    const allMethods = [...remappedMethods, ...exportedMethods];

    if (!allMethods.length) {
      console.warn(
        `${logPrefix} Unable to extract any methods from RCTBridgeModule named "${jsModuleName}".`
      );
    }

    acc[jsModuleName] = allMethods;

    return acc;
  }, /** @type {Record<string, string[]>} */ ({}));

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
  const interface = Object.keys(moduleNamesToMethods)
    .map((jsModuleName) => {
      const methodSignatures = moduleNamesToMethods[jsModuleName];
      return [
        `@interface ${jsModuleName}`,
        methodSignatures.join('\n\n'),
        `@end`,
      ].join('\n');
    })
    .join('\n\n');

  return interface;
}

/**
 * Gets the aliased name for a bridge module if there is one.
 * @param {string} classImplementation The source code for the bridge module's
 *   class implementation.
 * @returns {string|undefined} The aliased name for the bridge module as a
 *   string, or undefined if no alias was registered (in which case, the Obj-C
 *   class name should be used for the bridge module as-is).
 */
function extractBridgeModuleAliasedName(classImplementation) {
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
 * @param {string[]} args.autolinkedDeps podfile entries for each React Native
 *   dependency to be autolinked.
 * @param {string} args.reactNativePodspecsPackageDir An absolute path to the
 *   react-native-podspecs directory.
 * @returns
 */
async function writePodfile({ autolinkedDeps, reactNativePodspecsPackageDir }) {
  const outputPodfilePath = path.resolve(
    reactNativePodspecsPackageDir,
    'platforms/ios/Podfile'
  );

  /**
   * Depending on React and/or React-Core supports RNPodspecs.h, which imports
   * the <React/RCTBridgeModule.h> header. I'm not sure whether to include
   * these two lines (given we know that `@ammarahm-ed/react-native` is going
   * to include them anyway), but probably including them is better. For now,
   * though, I'll leave them out until it becomes a clear problem. The main
   * advantage is that it saves spinning up node wastefully.
   */
  const reactDeps = [
    // `pod 'React-Core', path: File.join(File.dirname(\`node --print "require.resolve('@ammarahm-ed/react-native/package.json')"\`), "platforms/ios/React-Core.podspec")`,
    // `pod 'React', path: File.join(File.dirname(\`node --print "require.resolve('@ammarahm-ed/react-native/package.json')"\`), "platforms/ios/React.podspec")`,
  ];

  /**
   * Depending on React-Native-Podspecs allows us to include our RNPodspecs.h
   * file.
   */
  const reactNativePodspecsDep = `pod 'React-Native-Podspecs', path: File.join(File.dirname(\`node --print "require.resolve('@ammarahm-ed/react-native-podspecs/package.json')"\`), "platforms/ios/React-Native-Podspecs.podspec")`;

  const podfileContents = [
    `# This file will be updated automatically by hooks/before-prepareNativeApp.js.`,
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
 * @param {string[]} args.headerEntries Sections of the header file to be filled
 *   in.
 * @param {string} args.reactNativePodspecsPackageDir An absolute path to the
 *   react-native-podspecs directory.
 * @returns A Promise to write the header file into the react-native-podspecs
 *   package.
 */
async function writeHeaderFile({
  headerEntries,
  reactNativePodspecsPackageDir,
}) {
  const outputHeaderPath = path.resolve(
    reactNativePodspecsPackageDir,
    'platforms/ios/lib/RNPodspecs.h'
  );

  const RNPodspecsInterface = [
    '// START: react-native-podspecs placeholder interface',
    '@interface RNPodspecs: NSObject',
    '@end',
    '// END: react-native-podspecs placeholder interface',
  ].join('\n');

  const header = [
    `#import <React/RCTBridgeModule.h>`,
    '',
    headerEntries.join('\n\n'),
    '',
    RNPodspecsInterface,
    '',
  ].join('\n');

  return await writeFile(outputHeaderPath, header, { encoding: 'utf-8' });
}
