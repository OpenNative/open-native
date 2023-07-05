import { assert, isNullOrUndefined, RNObjcSerialisableType } from '../common';
import {
  numberHasDecimals,
  numberIs64Bit,
} from '@nativescript/core/utils/types';
import { Utils } from '@nativescript/core';
import { isPromise } from './utils';

type RCTFunctionBlocks = [
  // Resolve
  (value: NSObject) => void | undefined,
  number,
  // Reject
  (...args: any[]) => void | undefined,
  number,
  // Callback
  (args: NSArray<NSObject> | null) => void | undefined,
  number,
  // Error callback
  (value: NSError) => void | undefined,
  number
];

function fromJSON(value: string) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.warn(e.message, e, value);
    return value;
  }
}

export function toNativeArguments(
  argumentTypes: RNObjcSerialisableType[],
  args: JSValuePassableIntoObjc[],
  resolve?: (value: JSONSerialisable) => void,
  reject?: (reason: Error) => void
): { arguments: RNNativeModuleMethodArg[]; blocks: RCTFunctionBlocks } {
  const nativeArguments: RNNativeModuleMethodArg[] = [];
  const blocks: RCTFunctionBlocks = [
    undefined,
    -1,
    undefined,
    -1,
    undefined,
    -1,
    undefined,
    -1,
  ];

  for (let i = 0; i < argumentTypes.length; i++) {
    const argType = argumentTypes[i];

    const data = args[i];

    switch (argType) {
      case RNObjcSerialisableType.returnType: {
        break;
      }
      case RNObjcSerialisableType.other: {
        throw new Error(
          `Unexpected type 'other' at index ${i} - the autolinker must have failed to parse the native module.`
        );
      }

      case RNObjcSerialisableType.array:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNObjcSerialisableType.nonnullArray: {
        data = fromJSON(data as string);
        assert(
          Array.isArray(data),
          `Argument at index ${i} expected an Array value, but got ${data}`
        );

        nativeArguments.push(toNativeValue(data, false) as ObjcJSONEquivalent);
        break;
      }

      case RNObjcSerialisableType.object:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNObjcSerialisableType.nonnullObject: {
        data = fromJSON(data as string);
        assert(
          data?.constructor === Object,
          `Argument at index ${i} expected an object value, but got ${data}`
        );

        nativeArguments.push(
          toNativeValue(
            data as JSONSerialisable | null,
            false
          ) as ObjcJSONEquivalent
        );
        break;
      }

      case RNObjcSerialisableType.boolean:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(false);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNObjcSerialisableType.nonnullBoolean:
        data = fromJSON(data as string);
        assert(
          typeof data === 'boolean',
          `Argument at index ${i} expected a boolean, but got ${data}`
        );

        // booleans are auto-marshalled to BOOL.
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.int:
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );

        // numbers are auto marshalled to int.
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.string:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNObjcSerialisableType.nonnullString:
        assert(
          typeof data === 'string',
          `Argument at index ${i} expected a string, but got ${data}`
        );

        // strings are auto-marshalled to NSString.
        nativeArguments.push(data);
        break;

      case RNObjcSerialisableType.number:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNObjcSerialisableType.nonnullNumber:
        data = fromJSON(data as string);
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );

        // numbers are auto-marshalled to NSNumber, but toNativeValue() may
        // preserve their contents better (it inspects whether they are 64-bit,
        // etc. and marshals accordingly).
        nativeArguments.push(toNativeValue(data, false) as NSNumber | number);
        break;

      case RNObjcSerialisableType.RCTResponseSenderBlock: {
        assert(
          typeof data === 'function',
          `Argument at index ${i} expected a function, but got ${data}`
        );

        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        blocks[4] = (args: NSArray<NSObject> | null) => {
          // Handle null as an empty array, and coerce an NSArray into JS
          // values.
          const callbackArgs = args
            ? (toJSValue(args) as JSONSerialisable[])
            : [];

          // Call back to the consumer with an array of JS values.
          (data as Function)(...callbackArgs);
        };
        blocks[5] = i;
        break;
      }

      case RNObjcSerialisableType.RCTResponseErrorBlock: {
        assert(
          typeof data === 'function',
          `Argument at index ${i} expected a function, but got ${data}`
        );

        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        blocks[6] = (value: NSError) => {
          // I've seen in an example that a user calls console.log(error.domain)
          // in the error handler of their RN native module's API call, so
          // returning the NSError as-is should give us the best API
          // compatibility with a React Native JS Error until we see a counter
          // case. We'll also get a nice stack trace as a result.
          (data as Function)(value);
        };
        blocks[7] = i;

        break;
      }

      case RNObjcSerialisableType.RCTPromiseResolveBlock: {
        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        blocks[0] = (value: NSObject) => {
          // Marshal the Obj-C value back to JS to resolve to the consumer.
          resolve(toJSValue(value) as JSONSerialisable);
        };
        blocks[1] = i;
        break;
      }

      case RNObjcSerialisableType.RCTPromiseRejectBlock: {
        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        blocks[2] = (
          code: NSString,
          message: NSString,
          nativeError: NSError | null
        ) => {
          // The nativeError may be nil (null on our side), so unlike the
          // RCTResponseErrorBlock, we'll need to construct an error afresh.
          const jsError = new Error(toJSValue(message) as string);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (jsError as Error & { code: string }).code = toJSValue(
            code
          ) as string;

          // In case NativeScript doesn't support the new Error 'cause' API,
          // I'll assign it directly to be safe.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (jsError as Error & { cause: NSError }).cause = nativeError;

          // Reject a JS error back to the consumer.
          reject(jsError);
        };
        blocks[3] = i;
        break;
      }
    }
  }

  return { arguments: nativeArguments, blocks };
}

function toJSError(error: NSError) {
  if (!error) return new Error('');
  // The nativeError may be nil (null on our side), so unlike the
  // RCTResponseErrorBlock, we'll need to construct an error afresh.
  const jsError = new Error(
    toJSValue(
      error.localizedDescription ||
        error.localizedFailureReason ||
        'Unknown error'
    ) as string
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (jsError as Error & { code: string }).code = toJSValue(error.code) as string;

  // In case NativeScript doesn't support the new Error 'cause' API,
  // I'll assign it directly to be safe.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (jsError as Error & { cause: NSError }).cause = error;

  return jsError;
}

export function promisify(
  invocation: NSInvocation,
  types: RNObjcSerialisableType[],
  args: JSValuePassableIntoObjc[]
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const nativeArguments = toNativeArguments(types, args, resolve, reject);

    try {
      reactNativeBridgeIOS.callMethodInvocationArgsSyncRRIRejRejICbCbIEEI(
        invocation,
        nativeArguments.arguments,
        false,
        ...nativeArguments.blocks
      );
    } catch (e) {
      reject(e);
    }
  });
}

function createInvocation(module: RCTBridgeModule, selector: string) {
  const sig = (module as NSObject).methodSignatureForSelector(selector);
  const invocation = NSInvocation.invocationWithMethodSignature(sig);
  invocation.selector = selector;
  invocation.target = module;
  return invocation;
}

export function invokeNativeMethod(
  selector: string,
  types: RNObjcSerialisableType[],
  args: never[],
  sync: boolean
) {
  const invocation =
    this.__invocationCache[selector] ||
    (this.__invocationCache[selector] = createInvocation(
      this.nativeModule,
      selector
    ));

  if (isPromise(types)) {
    return promisify.call(this, invocation, types, args);
  }
  const nativeArguments = toNativeArguments(types, args);

  return reactNativeBridgeIOS.callMethodInvocationArgsSyncRRIRejRejICbCbIEEI(
    invocation,
    nativeArguments.arguments,
    sync,
    ...nativeArguments.blocks
  );
}

export type JSONSerialisable =
  | string
  | boolean
  | number
  | null
  | JSONSerialisable[]
  | { [key: string]: JSONSerialisable };

export type RCTResponseSenderBlockType = (
  args: NSArray<NSObject> | null
) => void;
export type RCTResponseErrorBlockType = (value: NSError) => void;
export type RCTPromiseResolveBlockType = (value: NSObject) => void;
export type RCTPromiseRejectBlockType = (
  code: NSString,
  message: NSString,
  nativeError: NSError | null
) => void;
export type BlockTypes =
  | RCTResponseSenderBlockType
  | RCTResponseErrorBlockType
  | RCTPromiseResolveBlockType
  | RCTPromiseRejectBlockType;

export type RNNativeModuleArgType = JSONSerialisable | BlockTypes;

/**
 * All the JS types that an Obj-C type received from NativeScript could be
 * marshalled into. Essentially the same list as React Native's supported types
 * for native modules (all JSON-serialisable types and four shapes of
 * Promise/callback), but adding Date and support for any shape of function.
 */
export type JSValuePassableIntoObjc =
  | JSONSerialisable
  | Date
  | ((...args: unknown[]) => unknown)
  | JSValuePassableIntoObjc[]
  | { [key: string]: JSValuePassableIntoObjc };

/**
 * Checks whether a value (ostensibly from Obj-C) is a JS type already.
 */
function isJSValue(data: unknown): data is JSValuePassableIntoObjc {
  /**
   * blocks are coerced to JS functions:
   * typeof NSError.userInfoValueProviderForDomain(NSCocoaErrorDomain) === 'function' // true
   *
   * void is coerced to undefined:
   * typeof NSString.new().getCString('hi') === 'undefined' // true
   *
   * BOOL is coerced to boolean:
   * typeof NSString.new().canBeConvertedToEncoding(NSASCIIStringEncoding) === 'boolean' // true
   *
   * NSNumber is coerced to number:
   * typeof NSString.new().cStringLength() === 'number' // true
   */
  if (
    typeof data === 'function' ||
    typeof data === 'boolean' ||
    typeof data === 'string' ||
    typeof data === 'undefined' ||
    typeof data === 'number'
  ) {
    return true;
  }

  /**
   * nil is coerced to null:
   * @example
   * NDictionary.new().objectForKey('missing key') === null // true
   */
  if (data === null) {
    return true;
  }

  /**
   * NSDate.date() instanceof Date // false (it's an NSDate)
   * NSDate.now instanceof Date    // true
   */
  if (data instanceof Date) {
    return true;
  }

  /**
   * Handle JS arrays. Only returns true if all the array members are JS values.
   */
  if (Array.isArray(data)) {
    return !data.some((item) => !isJSValue(item));
  }

  /**
   * Handle object literals (which includes enums).
   * NSTextCheckingType.constructor === Object // true
   * Only returns true if all the values (recursively) are JS value.
   */
  if (data?.constructor === Object) {
    for (const key in data as Record<string, unknown>) {
      if (!isJSValue(data[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Converts native values to corresponding JS values. If accidentally passed a
 * JS value, will return it as-is. If passed a mixed array (e.g. NSObject[]) or
 * mixed record (e.g. Record<string, NSObject>), it'll create a new object that
 * is a deep JS value.
 *
 * TODO: implement 'strict' mode as in toNativeValue() to make sure we're not
 * unnecessarily marshalling between, say, NSDate and Date when the runtime
 * would do it for us anyway.
 */
export function toJSValue(
  data: NSObject | JSValuePassableIntoObjc | undefined
): JSValuePassableIntoObjc {
  if (isJSValue(data)) {
    return data;
  }

  /**
   * Handle the case of a mixed array (e.g. NSObject[]).
   */
  if (Array.isArray(data)) {
    return data.map((item) => toJSValue(item));
  }

  /**
   * Handle the case of a mixed record (e.g. Record<string, NSObject>).
   */
  if (data?.constructor === Object) {
    const obj: { [key: string]: JSValuePassableIntoObjc } = {};
    for (const key in data as unknown as Record<string, unknown>) {
      obj[key] = toJSValue(data[key]);
    }
    return obj;
  }

  // That's all of the cases of accidental JS value inputs I can think of out of
  // the way, so now we continue onto the actual NSObjects to marshal.

  if (data instanceof NSDictionary) {
    const obj: { [key: string]: JSValuePassableIntoObjc } = {};
    const length = data.count;
    const keysArray = data.allKeys;
    for (let i = 0; i < length; i++) {
      const nativeKey = keysArray.objectAtIndex(i);
      obj[nativeKey] = toJSValue(data.objectForKey(nativeKey));
    }
    return obj;
  }

  if (data instanceof NSArray) {
    const array = [];
    const len = data.count;
    for (let i = 0; i < len; i++) {
      array[i] = toJSValue(data.objectAtIndex(i));
    }
    return array;
  }

  if (data instanceof NSDate) {
    return new Date(data.timeIntervalSince1970 * 1000);
  }

  if (data instanceof NSNumber) {
    return data.doubleValue;
  }

  if (data instanceof NSString) {
    return data.UTF8String;
  }

  /**
   * While a native API call would return null rather than NSNull, the user
   * might have simply passed NSNull into this function explicitly.
   */
  if (data instanceof NSNull) {
    return null;
  }

  if (data instanceof NSError) return toJSError(data) as any;

  return Utils.dataDeserialize(data);
}

/**
 * Converts the given value (where necessary) into a value that can be passed
 * directly into an Obj-C function.
 *
 * The 'where necessary' refers firstly to the fact that NativeScript supports
 * directly passing certain JS values directly into native function calls,
 * marshalling them into equivalent NSObjects under-the-hood:
 *
 * NSString.alloc()
 *   .initWithString('しらかば')
 *   .stringByApplyingTransformReverse('Hiragana-Latin', false);
 *
 * ... and secondly, to the fact that sometimes you won't be sure whether a
 * native API will return you a JS string or an NSString. If toNativeValue() is
 * passed a value that is already an NSObject, it will be left as-is.
 *
 * @param data A JSON-serializable JS value, or a JS function, or Date, or
 *   undefined.
 * @param strict A boolean expressing the marshalling strategy for JS numbers
 * and strings, given that they may be passed to native functions as-is.
 * - true: all strings and numbers are always coerced to NSString and NSNumber.
 * - false: all strings and non-64-bit numbers that are integers are preserved
 *   as JS values, so that you can delegate to the runtime's auto-marshalling.
 * This is handy if you're not sure whether you have a JS number or an NSNumber,
 * but want to use NSNumber APIs on the return value without additional checks.
 */
export function toNativeValue<T extends boolean>(
  data: JSValuePassableIntoObjc | NSObject | undefined,
  strict: T
):
  | NSObject
  | boolean
  | null
  | ((...args: unknown[]) => unknown)
  | (T extends false ? string | number : never) {
  /**
   * If we were passed an NSObject by accident, return it as-is.
   */
  if (data instanceof NSObject) {
    return data;
  }

  /**
   * JS functions are coerced to blocks:
   * NSArray.new().enumerateObjectsUsingBlock(val => console.log(val));
   *
   * BOOL is coerced to boolean:
   * typeof NSString.new().canBeConvertedToEncoding(NSASCIIStringEncoding) === 'boolean' // true
   *
   * NSNumber is coerced to number:
   * typeof NSString.new().cStringLength() === 'number' // true
   */
  if (typeof data === 'function') {
    return data;
  }

  /**
   * Obj-C (unlike Swift) has no equivalent of an undefined/optional function
   * param. Rather than converting implicitly to null, we should catch such
   * cases early.
   */
  if (typeof data === 'undefined') {
    throw new Error(
      `Unable to marshal \`undefined\` to Obj-C; try passing null instead.`
    );
  }

  /**
   * In strict mode, we'll marshal all strings and numbers explicitly rather
   * than leaving it to the runtime.
   */
  if (strict) {
    if (typeof data === 'string') {
      return NSString.alloc().initWithString(data);
    }
    // Any other kinds of numbers are handled by Utils.dataSerialize().
    if (
      typeof data === 'number' &&
      !numberIs64Bit(data) &&
      !numberHasDecimals(data)
    ) {
      return NSNumber.alloc().initWithInt(data);
    }
  }

  /**
   * NativeScript supports passing various types to native functions directly as
   * JS values. Utils.dataSerialize() sensibly handles all remaining types that
   * we haven't handled above.
   */
  return Utils.dataSerialize(data);
}

export type ObjcJSONEquivalent =
  | NSString
  | NSNumber
  | null
  | boolean
  | NSDictionary<NSString, ObjcJSONEquivalent>
  | NSArray<ObjcJSONEquivalent>;

/**
 * All the argument types that can be passed into a React Native native API
 * call by NativeScript. Some JS primitives are included because NativeScript
 * supports auto-marshalling.
 */
export type RNNativeModuleMethodArg =
  | ObjcJSONEquivalent
  | number
  | string
  | BlockTypes;
