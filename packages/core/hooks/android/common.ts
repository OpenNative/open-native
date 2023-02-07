import * as fs from 'fs';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import * as path from 'path';
import { promisify } from 'util';
export const readFile = promisify(fs.readFile);
export const readFileSync = fs.readFileSync;
export const exists = promisify(fs.exists);
export const _writeFile = promisify(fs.writeFile);

export const logPrefix = '[@open-native/core/hooks/prepare-android.js]';
/**
 * A writeFile wrapper that only writes the file
 * if the contents have changed.
 */
export async function writeFile(
  output: fs.PathOrFileDescriptor,
  contents: string | NodeJS.ArrayBufferView,
  options: fs.WriteFileOptions
) {
  if (fs.existsSync(output as fs.PathLike)) {
    const readContents = await readFile(output, options);
    if (readContents === contents) return;
  }
  console.log(
    `[@open-native/core/hooks/before-prepareNativeApp.js]: Writing ${path.basename(
      output as string
    )}`
  );
  return await _writeFile(output, contents, options);
}

export function globProm(
  pattern: string,
  options: IOptions
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      return err ? reject(err) : resolve(matches);
    });
  });
}

export type AndroidDependencyParams = {
  sourceDir?: string;
  manifestPath?: string;
  packageName?: string;
  dependencyConfiguration?: string;
  packageImportPath?: string;
  packageInstance?: string;
  buildTypes?: string[];
  libraryName?: string | null;
  componentDescriptors?: string[] | null;
  androidMkPath?: string | null;
  cmakeListsPath?: string | null;
};

// FIXME: need to figure out a proper pattern for importing this from its own
// package (but outside the hooks directory, which has its own tsconfig). For
// now, we'll just have to maintain an identical copy of this enum within the
// hook.
export enum RNJavaSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // @Nullable String
  nonnullString, // String
  boolean, // Boolean
  nonnullBoolean, // boolean
  int, // Integer (deprecated)
  nonnullInt, // int (deprecated)
  double, // double
  nonnullDouble, // Double
  float, // Float (deprecated)
  nonnullFloat, // float (deprecated)
  nonnullObject, // ReadableMap
  object, // @Nullable ReadableMap
  array, // @Nullable ReadableArray
  nonnullArray, // ReadableArray
  Callback, // @Nullable Callback
  nonnullCallback, // Callback
  Promise, // Promise
}

export type ModuleMap = {
  [exportedModuleName: string]: {
    /** jsModuleName */
    j: string;
    /** exportsConstants */
    e: boolean;
    /** methods */
    v: boolean;
    m: {
      [methodName: string]: {
        /** isBlockingSynchronousMethod */
        b: boolean;
        /** jsMethodName */
        j: string;
        /** types */
        t: RNJavaSerialisableType[];
        p: string;
        nd: string
      };
    };
  };
}
