import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import type { IOptions } from 'glob';
import * as glob from 'glob';
export const execFile = promisify(cp.execFile);
export const readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);

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
  console.log(`${logPrefix}: Writing ${path.basename(output as string)}`);
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

export const logPrefix = '[@open-native/core/hooks/prepare-ios.js]';

export interface MethodDescription {
  exportedName: string;
  jsName: string;
  selector: string;
  signature: string;
  types: string[];
}

// FIXME: need to figure out a proper pattern for importing this from its own
// package (but outside the hooks directory, which has its own tsconfig). For
// now, we'll just have to maintain an identical copy of this enum within the
// hook.
export enum RNObjcSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // NSString*
  nonnullString, // nonnull NSString*
  boolean, // NSNumber* (bounded between 0 and 1, presumably)
  nonnullBoolean, // BOOL
  number, // NSNumber*
  nonnullNumber, // nonnull NSNumber*, double (and the deprecated float,
  // CGFloat, and NSInteger)
  int, // Not documented but is used by some modules, just int.
  array, // NSArray*
  nonnullArray, // nonnull NSArray*
  object, // NSDictionary*
  nonnullObject, // nonnull NSDictionary*
  RCTResponseSenderBlock,
  RCTResponseErrorBlock,
  RCTPromiseResolveBlock,
  RCTPromiseRejectBlock,
  returnType,
}

export interface ModuleNamesToMethodDescriptions {
  [moduleName: string]: {
    jsName: string;
    exportsConstants: boolean;
    hasMethodQueue: boolean;
    methods: MethodDescription[];
    isSwiftModule: boolean;
  };
}

export interface MethodDescriptionsMinimal {
  /**
   * The method name specified in RCT_EXPORT_METHOD() or RCT_REMAP_METHOD().
   * @example For RCT_EXPORT_METHOD(show), it would be 'show'.
   */
  [exportedMethodName: string]: {
    /**
     * The equivalent method name once mapped into a JS-friendly property by the
     * NativeScript metadata generator.
     * @example 'showWithRejecter'
     */
    j: string;
    /**
     * The types (first the return type, followed by each of the params) mapped
     * to an enum.
     * @example [1, 14, 15]
     */
    t: RNObjcSerialisableType[];
  };
}

export interface ModuleNamesToMethodDescriptionsMinimal {
  [exportedModuleName: string]: {
    /**
     * The Obj-C class name for the module, mapped into a JS-friendly name for
     * access from NativeScript. As I'm unclear NativeScript does any remapping
     * of classnames, it's simply the same as the Obj-C name.
     * @example 'RCTLinkingManager', given the exported name 'LinkingManager'
     */
    j: string;
    /**
     * Whether the module exports any constants.
     * @example true
     */
    e: boolean;
    /**
     * The methods exported by the module.
     */
    m: MethodDescriptionsMinimal;
    /**
     * Whether the module defines it's own methodQueue.
     */
    mq: boolean;
  };
}
