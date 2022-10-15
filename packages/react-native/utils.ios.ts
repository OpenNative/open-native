import { RNObjcSerialisableType } from './common';

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
  [exportedModuleName: string]: {
    e: boolean;
    m: TModuleMethodsType;
  };
}

/**
 * Returns all the keys (automatically sanitised by NativeScript for JS) on a
 * given React Native native module's Obj-C class. A subset of these keys will
 * be the Obj-C method names (again, sanitised for JS).
 */
export function getModuleMethods(module: RCTBridgeModule): string[] {
  const keys: string[] = [];

  // The for...in loop is important here as NativeScript does not necessarily
  // return native keys by other means like Object.keys(module).
  for (const key in module) keys.push(key);

  return keys;
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
