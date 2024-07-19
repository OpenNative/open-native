import { readFile, readFileSync } from '../common';

/**
 * Read in an Android manifest and extract the package name from it.
 */
export async function getAndroidPackageName(
  manifestPath: string,
  buildGradlePath: string
): Promise<string> {
  const bgRed = '\x1b[41m';
  const dim = '\x1b[2m';
  const underline = '\x1b[4m';
  const reset = '\x1b[0m';

  const androidManifest = readFileSync(manifestPath, 'utf8');
  let packageNameMatchArray = androidManifest.match(/package="(.+?)"/);

  if (!packageNameMatchArray || packageNameMatchArray.length === 0) {
    const buildGradle = readFileSync(buildGradlePath, 'utf8');
    packageNameMatchArray = buildGradle.match(/namespace[ |=]"(.+?)"/);

    if (!packageNameMatchArray || packageNameMatchArray.length === 0) {
      throw new Error(
        `Failed to build the app: No package name found. Found errors in ${underline}${dim}${manifestPath}`
      );
    }
  }

  const packageName = packageNameMatchArray[1];

  if (!validateAndroidPackageName(packageName)) {
    console.warn(
      `Invalid application's package name "${bgRed}${packageName}${reset}" in 'AndroidManifest.xml'. Read guidelines for setting the package name here: ${underline}${dim}https://developer.android.com/studio/build/application-id`
    );
  }
  return packageName;
}

export function validateAndroidPackageName(packageName: string) {
  return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName);
}
