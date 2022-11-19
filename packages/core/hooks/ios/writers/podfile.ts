import { writeFile } from '../common';

/**
 *
 * @param {object} args
 * @param args.autolinkedDeps podfile entries for each React Native dependency
 *   to be autolinked.
 * @param args.outputPodfilePath An absolute path to output the Podfile to.
 * @returns A Promise to write the podfile into the specified location.
 */
export async function writePodfile({
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
