import { RNObjcSerialisableType } from '../common';

// FIXME: once hooks support ESM, find a way to code-share this interface with
// prepare-ios.ts rather than just duplicating it.
export interface TModuleMethodsType {
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

export interface TNativeModuleMap {
  [exportedModuleName: string]: RNNativeModuleMetadata;
}

export interface RNNativeModuleMetadata {
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
   * A record of methods exported by the module, indexed by exported method
   * name.
   */
  m: TModuleMethodsType;
}

/**
 * Evaluates whether a given React Native native module method should return a
 * Promise, based on its method types.
 */
export function isPromise(
  moduleMethods: TModuleMethodsType,
  methodName: string
): boolean {
  // We search for RCTPromiseResolveBlock only from index 1 onwards, as index 0
  // holds the return type rather than the params.
  return moduleMethods[methodName].t.includes(
    RNObjcSerialisableType.RCTPromiseResolveBlock,
    1
  );
}
