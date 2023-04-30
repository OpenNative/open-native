import * as path from 'path';
import { OpenNativeConfig, readFile } from './common';
import { getPackageAutolinkInfo } from './getters/autolink-info';
import { writeModuleMapFile } from './writers/modulemap';
import { writePodfile } from './writers/podfile';
import { writeReactNativePodspecFile } from './writers/react-native-podspec';
import { writeRNPodspecsHeaderFile } from './writers/rn-podspecs-header';

type AutolinkIosParams = {
  packageDir: string;
  dependencies: string[];
  projectDir: string;
  outputHeaderPath: string;
  outputPodfilePath: string;
  outputPodspecPath: string;
  outputModuleMapPath: string;
  config: OpenNativeConfig;
};

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
  config,
}: AutolinkIosParams) {
  const packageJson = JSON.parse(
    await readFile(path.join(packageDir, '/package.json'), {
      encoding: 'utf8',
    })
  );

  const autolinkingInfo = (
    await Promise.all(
      dependencies.map((packageName) =>
        getPackageAutolinkInfo({
          ownPackageName: packageJson.name,
          packageName,
          projectDir,
          config,
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
    await writeRNPodspecsHeaderFile({
      importDecls: autolinkingInfo.map(({ importDecl }) => importDecl),
      headerEntries: autolinkingInfo.map(({ headerEntry }) => headerEntry),
      outputHeaderPath,
    }),

    await writePodfile({
      autolinkedDeps: autolinkingInfo.map(({ podfileEntry }) => podfileEntry),
      outputPodfilePath,
    }),

    await writeReactNativePodspecFile({
      podspecNames: autolinkingInfo
        .map(({ podspecName, subspecNames }) => {
          return podspecName ? [podspecName, ...subspecNames] : subspecNames;
        })
        .flat(),
      outputPodspecPath,
    }),

    await writeModuleMapFile({
      moduleNamesToMethodDescriptions: moduleNamesToMethodDescriptionsCombined,
      outputModuleMapPath,
    }),
  ]);

  return autolinkingInfo.map(({ packageName }) => packageName);
}
