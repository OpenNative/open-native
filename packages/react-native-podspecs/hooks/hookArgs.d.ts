/**
 * For all available hook types, see:
 * @see https://github.com/NativeScript/NativeScript/blob/9ccc54b6035c04e383d9256fb3ad9c0c7b00fa20/packages/core/config/config.interface.ts#L134
 * @see https://github.com/NativeScript/nativescript-hook/issues/11#issuecomment-457705213
 * @see https://docs.npmjs.com/cli/v6/using-npm/scripts#pre--post-scripts
 * @see https://github.com/NativeScript/nativescript-app-templates/blob/master/packages/template-hello-world-ts/hooks/after-createProject/after-createProject.js
 * @see https://www.nsplugins.com/plugin/nativescript
 * @see https://github.com/NativeScript/plugins/tree/31b0f5157d02fdf17e89ac29233585cb7e4ebf6f/packages/localize/hooks
 * @see https://github.com/NativeScript/nativescript-cli/blob/master/extending-cli.md
 * @see https://blog.nativescript.org/migrating-cli-hooks-to-nativescript-6.0/
 * @see https://github.com/NativeScript/nativescript-cli/blob/c61edbeef668b9c17e744d7af3909306c435a16a/lib/project-data.ts
 */
export interface HookArgs {
  /**
   * @example "/Users/jamie/Documents/git/nativescript-magic-spells/apps/demo/platforms/ios"
   */
  projectRoot: string;
  projectData: ProjectData;
  platformData: PlatformData;
  /**
   * Just lists out projectRoot, projectData, and platformData again in an
   * array.
   */
  $arguments: [string, object, object];
}

/**
 * @see https://github.com/NativeScript/nativescript-cli/blob/master/lib/services/android-project-service.ts
 * @see https://github.com/NativeScript/nativescript-cli/blob/master/lib/services/ios-project-service.ts
 */
export interface ProjectData {
  /**
   * The absolute path to the root of your project. Typically where you'd see
   * package.json, webpack.config.js, nativescript.config.js, and the
   * platforms directory.
   */
  projectDir: string;
  /**
   * The absolute path to the platforms directory.
   */
  platformsDir: string;
  projectConfig: unknown;
  /**
   * The filepath to the package.json file for your project.
   */
  projectFilePath: string;
  /**
   * I'm unclear of the exact type of this.
   */
  projectIdentifiers: { ios: string; android: string } | string;
  /**
   * The directory name of your projectDir.
   */
  projectName: string;
  /**
   * The full contents of package.json.
   */
  packageJsonData: unknown;
  /**
   * The full contents of nativescript.config.ts. Defined here:
   * @see https://github.com/NativeScript/NativeScript/blob/9ccc54b6035c04e383d9256fb3ad9c0c7b00fa20/packages/core/config/config.interface.ts#L153
   */
  nsConfig: unknown;
  appDirectoryPath: string;
  /**
   * From nativescript.config.ts. The absolute path to App_Resources.
   */
  appResourcesDirectoryPath: string;
  /**
   * From package.json. The record of dependencies.
   */
  dependencies: Record<string, string>;
  /**
   * From package.json. The record of devDependencies.
   */
  devDependencies: Record<string, string>;
  /**
   * From nativescript.config.ts. Optionally specify a list of npm package names
   * for which you would like the NativeScript CLI to ignore when attaching
   * native dependencies to the build.
   */
  ignoredDependencies: string[];
  /**
   * The renderer or template, e.g. "Angular", "Vue.js", "React", "Svelte",
   * "Pure TypeScript", "Pure JavaScript".
   * @see https://github.com/NativeScript/nativescript-cli/blob/3150049f8076b12fed7deb86dc221490c8d13394/test/project-data.ts#L93
   */
  projectType: string;
  androidManifestPath: string;
  infoPlistPath: string;
  appGradlePath: string;
  gradleFilesDirectoryPath: string;
  buildXcconfigPath: string;
  podfilePath: string;
  isShared: boolean;
  previewAppSchema: string;
  webpackConfigPath: string;
  initialized: boolean;
}

/**
 * @see https://github.com/NativeScript/nativescript-cli/blob/fa257dd455ca55374cf419d638ac74166dc727db/lib/services/android-project-service.ts#L200
 * @see https://github.com/NativeScript/nativescript-cli/blob/1435eef272aced36e7f97a355ff5c7ea936f94e7/lib/services/ios-project-service.ts#L131
 */
export interface PlatformData {
  frameworkPackageName: string;
  normalizedPlatformName: 'iOS' | 'Android';
  platformNameLowerCase: 'ios' | 'android';
}
