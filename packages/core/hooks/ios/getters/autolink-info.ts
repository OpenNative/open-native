import * as path from 'path';
import {
  execFile,
  globProm,
  logPrefix,
  ModuleNamesToMethodDescriptionsMinimal,
  OpenNativeConfig,
  readFile,
} from '../common';
import { getPodspecFilePath } from './podspec-path';
import { getSourceFilePaths } from './source-file-paths';
import { extractInterfaces } from '../extractors/interface';
import { writePublicSwiftModule } from '../writers/swift-module';
import { resolvePackagePath } from '@rigor789/resolve-package-path';

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
export async function getPackageAutolinkInfo({
  ownPackageName,
  packageName,
  projectDir,
  config,
}: {
  ownPackageName: string;
  packageName: string;
  projectDir: string;
  config: OpenNativeConfig;
}) {
  const packagePath = resolvePackagePath(packageName, { paths: [projectDir] });
  const packageConfig = config?.modules?.[packageName]?.['ios'];

  if (!packagePath) {
    console.warn(
      `${logPrefix} Path for package ${packageName} not found. skipping.`
    );
    return;
  }
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

  const { podspecFileName, podspecFilePath } = getPodspecFilePath({
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
    subspecs?: {
      name?: string;
      source_files?: string | string[];
    }[];
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

  const podspecHasSourceFiles =
    commonSourceFiles.length > 0 || iosSourceFiles.length > 0;

  const subspecPaths = [];
  const subspecs = {};
  if (packageConfig?.podSubspecs) {
    for (const subspecName of packageConfig.podSubspecs) {
      const subspec = podspecParsed['subspecs']?.find(
        (subspec) => subspec.name === subspecName
      );
      if (subspec) {
        subspecs[subspecName] = subspec;
        subspecPaths.push(...subspec.source_files);
      } else {
        console.warn(
          `${logPrefix} Subspec ${subspecName} was not found in "${podspecFileName}" for npm package "${packageName}".`
        );
      }
    }
  }

  const sourceFilePaths = await getSourceFilePaths({
    commonSourceFiles:
      ownPackageName === packageName
        ? [commonSourceFiles as string, 'lib_core/React/CoreModules/*.{m,mm}']
        : [...commonSourceFiles, ...subspecPaths],
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

  const podfileEntry = packageConfig?.podSubspecs
    ? `pod '${podspecName}', :subspecs => [${packageConfig?.podSubspecs
        .map((name) => `"${name}"`)
        .join(',')}], :podspec => '${podspecFilePath}'`
    : `pod '${podspecName}', path: '${podspecFilePath}'`;

  const sourceFileInfoArr = await Promise.all(
    sourceFilePaths.map(async (sourceFilePath) => {
      const sourceFileContents = await readFile(sourceFilePath, {
        encoding: 'utf8',
      });

      const sourceFileName = path.basename(sourceFilePath);
      // TODO: We should ideally strip comments before running any Regex.
      const {
        interfaceDecl,
        moduleNamesToMethodDescriptions,
        isSwiftModuleInterface,
      } = extractInterfaces(sourceFileContents, sourceFilePaths);
      // console.log(
      //   `!! working out importDecl, given clangModuleName "${clangModuleName}"; sourceFilePath "${sourceFilePath}"`
      // );

      // FIXME: this is a lazy, provisional trick to get the import declaration.
      // We assume that the source file is a .m file and that it declares its
      // classes in a file with the same name but a .h extension (and woe betide
      // us if they declare the class only in the .m file). This is
      // conventionally a safe assumption, but you just know some packages out
      // there will do things differently to make life hard for us.
      const headerFileName = sourceFileName.replace(/\.mm?$/, '');
      const importDecl =
        sourceFileName.includes('.swift') || isSwiftModuleInterface
          ? ''
          : `#import <${clangModuleName}/${headerFileName}.h>`;

      /**
       * Rewrite the implementation of interface in swift
       * & make the class & it's methods public.
       */
      if (isSwiftModuleInterface) {
        await writePublicSwiftModule(
          moduleNamesToMethodDescriptions,
          sourceFilePaths
        );
      }

      return {
        interfaceDecl,
        sourceFileName,
        // Add import decl only if the module has an interface decl
        importDecl: interfaceDecl ? importDecl : '',
        moduleNamesToMethodDescriptions,
        isSwiftModuleInterface,
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
      : [
          ...new Set(sourceFileInfoArr.map(({ importDecl }) => importDecl)),
        ].join('\n'),
    moduleNamesToMethodDescriptions:
      sourceFileInfoArr.reduce<ModuleNamesToMethodDescriptionsMinimal>(
        (acc, { moduleNamesToMethodDescriptions }) =>
          Object.assign(acc, moduleNamesToMethodDescriptions),
        {}
      ),
    packageName,
    podfileEntry,
    podspecName: podspecHasSourceFiles ? podspecName : undefined,
    subspecNames: Object.keys(subspecs).map((name) => `${podspecName}/${name}`),
  };
}
