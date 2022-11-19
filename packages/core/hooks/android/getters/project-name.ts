/**
 * Create a valid Android project name that corresponds uniquely to the npm
 * package name.
 */
export function createAndroidPackageName(npmPackageName: string) {
  return npmPackageName.replace(/@/g, '').replace(/\//g, '_');
}
