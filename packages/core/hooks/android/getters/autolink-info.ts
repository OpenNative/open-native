import { AndroidDependencyParams, exists, logPrefix } from '../common';
import * as path from 'path';
import { getManifestPath } from './manifest-path';
import { getAndroidPackageName } from './package-name';
import { extractPackageModules } from '../extractors/modules';
import { extractLibraryName } from '../extractors/library-name';
import { extractComponentDescriptors } from '../extractors/component-descriptors';
import { createAndroidPackageName } from './project-name';
import { resolvePackagePath } from '@rigor789/resolve-package-path';
/**
 * @param {object} args
 * @param args.npmPackageName The package name, e.g. 'react-native-module-test'.
 * @param args.ownPackageName The name for the package holding this hook,
 *   e.g. 'open-native_core', which holds core modules rather than
 *   community modules. It'll look for the Android native modules for core by a
 *   special path.
 * @param args.projectDir The project directory (relative to which the package
 *   should be resolved).
 * @param args.userConfig The dependencies[packageName]platforms.android section
 *   of react-native-config.js.
 */
export async function getPackageAutolinkInfo({
  npmPackageName,
  ownPackageName,
  projectDir,
  // This empty userConfig is a stub to reduce refactoring if we come to support
  // react-native.config.js in future.
  // https://github.com/react-native-community/cli/blob/4a6e64dad57536e4e64eb68471511463269d35d5/docs/dependencies.md#dependency-interface
  userConfig = {},
}: {
  npmPackageName: string;
  ownPackageName: string;
  projectDir: string;
  userConfig?: AndroidDependencyParams;
}) {
  const packagePath = resolvePackagePath(npmPackageName, {
    paths: [projectDir],
  });
  if (!packagePath) {
    console.warn(
      `${logPrefix} Path for package ${npmPackageName} not found. skipping.`
    );
    return;
  }
  /**
   * Detect whether we're autolinking our own React Native bridge
   * implementation. If so, we'll adjust a few things because it's not a
   * standard native module.
   */
  const isCore = npmPackageName === ownPackageName;
  const sourceDir = path.join(
    packagePath,
    isCore
      ? 'react-android/react/src/main/java/com/facebook'
      : userConfig.sourceDir || 'android'
  );
  if (!(await exists(sourceDir))) {
    // Not an Android native module.
    return;
  }

  const manifestPath = isCore
    ? path.join(packagePath, 'react-android/react/src/main/AndroidManifest.xml')
    : userConfig.manifestPath
    ? path.join(sourceDir, userConfig.manifestPath)
    : await getManifestPath(sourceDir);
  if (!manifestPath) {
    return;
  }

  const androidPackageName =
    userConfig.packageName || (await getAndroidPackageName(manifestPath));
  const parsed = await extractPackageModules(sourceDir);
  if (!parsed) {
    return null;
  }
  const { modules, packageClassName } = parsed;

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
    userConfig.libraryName || extractLibraryName(packagePath, sourceDir);

  /**
   * At least so far, I'm not aware of us having any React components to export
   * from our core library, so we can skip this bit.
   */
  const componentDescriptors = isCore
    ? []
    : userConfig.componentDescriptors ||
      (await extractComponentDescriptors(packagePath));
  const androidMkPath = userConfig.androidMkPath
    ? path.join(sourceDir, userConfig.androidMkPath)
    : path.join(sourceDir, 'build/generated/source/codegen/jni/Android.mk');
  const cmakeListsPath = userConfig.cmakeListsPath
    ? path.join(sourceDir, userConfig.cmakeListsPath)
    : path.join(sourceDir, 'build/generated/source/codegen/jni/CMakeLists.txt');

  const modulesWithImportNames = modules.map(
    ({
      moduleClassName,
      exportedMethods,
      exportedModuleName,
      exportsConstants,
      moduleImportPath,
      isPublic,
    }) => {
      const moduleImportName = `${moduleImportPath}.${moduleClassName}`;
      // Unlike with Obj-C methods, NativeScript doesn't have to sanitise Java
      // class names for JS as far as I know.
      const moduleClassNameJs = moduleClassName;
      const moduleImportNameJs = `${packageImportPath
        .replace(';', '')
        .replace(/import\s+/, '')
        .split('.')
        .slice(0, -1)
        .join('.')}.${moduleClassNameJs}`;

      return {
        exportedMethods,
        /** @example 'RNTestModule' - as exported by getName() */
        exportedModuleName,
        /** @example false - whether the module exports constants or not. */
        exportsConstants,
        /** @example 'RNTestModule' - the name of the Java class in Java */
        moduleClassName,
        /**
         * @example 'RNTestModule' - the name of the Java class in NativeScript.
         */
        moduleClassNameJs,
        /**
         * The name of the Java class in Java, with all namespacing.
         * @example 'com.test.RNTestModule'
         */
        moduleImportName,
        /**
         * The name of the Java class in NativeScript, with all namespacing.
         * @example 'com.test.RNTestModule'
         */
        moduleImportNameJs,
        /**
         * Whether this module is public or private.
         */
        isPublic,
      };
    }
  );

  return {
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android/build/generated/source/codegen/jni/Android.mk' */
    androidMkPath,
    /** @example 'react-native-module-test' */
    androidProjectName: createAndroidPackageName(npmPackageName),
    /** @example [] */
    buildTypes,
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android/build/generated/source/codegen/jni/CMakeLists.txt' */
    cmakeListsPath,
    /** @example [] */
    componentDescriptors,
    /** @example undefined */
    dependencyConfiguration,
    /** @example undefined */
    libraryName,
    modules: modulesWithImportNames,
    /** @example 'react-native-module-test' */
    npmPackageName,
    /** @example 'import com.testmodule.RNTestModulePackage;' */
    packageImportPath,
    /** @example 'new RNTestModulePackage()' */
    packageInstance,
    /** @example '/Users/jamie/Documents/git/nativescript-magic-spells/dist/packages/react-native-module-test/android' */
    sourceDir,
  };
}
