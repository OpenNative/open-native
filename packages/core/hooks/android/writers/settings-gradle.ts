import { readFile, writeFile } from '../common';

export async function writeSettingsGradleFile(projectDir: string) {
  const settingsGradlePath = projectDir + '/platforms/android/settings.gradle';
  const settingsGradlePatch = `// Mark open-native_core patch
  def reactNativePkgJson = new File(["node", "--print", "require.resolve('@open-native/core/package.json')"].execute(null, rootDir).text.trim())
  def reactNativeDir = reactNativePkgJson.getParentFile().absolutePath
  import groovy.json.JsonSlurper
  def modules = new JsonSlurper().parse(new File(reactNativeDir, "react-android/bridge/modules.json"));
  
  include ':react'
  project(":react").projectDir = new File(reactNativeDir, "react-android/react/")
  include ':bridge'
  project(":bridge").projectDir = new File(reactNativeDir, "react-android/bridge/")
  
  def selfModuleName = "open-native_core"
  modules.each {
    if (!it.androidProjectName.equals(selfModuleName)) {
      include ":\${it.androidProjectName}"
      project(":\${it.androidProjectName}").projectDir = new File(it.absolutePath)
    }
  }
  `;

  const currentSettingsGradle = await readFile(settingsGradlePath, {
    encoding: 'utf-8',
  });
  if (currentSettingsGradle.includes('Mark open-native_core patch')) return;
  return await writeFile(
    settingsGradlePath,
    [currentSettingsGradle, settingsGradlePatch].join('\n'),
    {
      encoding: 'utf-8',
    }
  );
}
