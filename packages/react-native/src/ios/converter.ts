import { RNObjcSerialisableType } from '../common';
import { Utils } from '@nativescript/core';
import {
  getClass,
  numberHasDecimals,
  numberIs64Bit,
} from '@nativescript/core/utils/types';

export function toNativeArguments(
  methodTypes: RNObjcSerialisableType[],
  args: JSValuePassableIntoObjc[],
  resolve?: (value: JSONSerialisable) => void,
  reject?: (reason: Error) => void
): RNNativeModuleMethodArg[] {
  const nativeArguments: RNNativeModuleMethodArg[] = [];

  assert(
    methodTypes.length,
    'Method signature empty, so unable to call native method.'
  );

  const argumentTypes = methodTypes.slice(1);
  assert(
    argumentTypes.length === args.length,
    `Expected ${argumentTypes.length} arguments, but got ${args.length}. Note that Obj-C does not support optional arguments.`
  );

  for (let i = 0; i < argumentTypes.length; i++) {
    const argType = argumentTypes[i];
    const data = args[i];

    assert(
      typeof data !== 'undefined',
      `Unexpected \`undefined\` value passed in at index ${i} for argument type "${RNObjcSerialisableType[argType]}". Note that Obj-C does not have an equivalent to undefined.`
    );

    if (
      argType === RNObjcSerialisableType.nonnullArray ||
      argType === RNObjcSerialisableType.nonnullBoolean ||
      argType === RNObjcSerialisableType.nonnullNumber ||
      argType === RNObjcSerialisableType.nonnullObject ||
      argType === RNObjcSerialisableType.nonnullString
    ) {
      assert(
        data !== null,
        `Unexpectedly got null for nonnull argument type "${RNObjcSerialisableType[argType]}."`
      );
    }

    switch (argType) {
      case RNObjcSerialisableType.other: {
        throw new Error(
          `Unexpected type 'other' at index ${i} - the autolinker must have failed to parse the native module.`
        );
      }

      case RNObjcSerialisableType.array:
      case RNObjcSerialisableType.nonnullArray: {
        assert(
          data === null || Array.isArray(data),
          `Argument at index ${i} expected an Array value, but got ${data}`
        );

        nativeArguments.push(toNativeValue(data, false) as ObjcJSONEquivalent);
        break;
      }

      case RNObjcSerialisableType.object:
      case RNObjcSerialisableType.nonnullObject: {
        assert(
          data === null || data?.constructor === Object,
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
      case RNObjcSerialisableType.nonnullBoolean:
        assert(
          typeof data === 'boolean',
          `Argument at index ${i} expected a boolean, but got ${data}`
        );

        // booleans are auto-marshalled to BOOL.
        nativeArguments.push(data);
        break;

      case RNObjcSerialisableType.string:
      case RNObjcSerialisableType.nonnullString:
        assert(
          typeof data === 'string',
          `Argument at index ${i} expected a string, but got ${data}`
        );

        // strings are auto-marshalled to NSString.
        nativeArguments.push(data);
        break;

      case RNObjcSerialisableType.number:
      case RNObjcSerialisableType.nonnullNumber:
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
        nativeArguments.push((args: NSArray<NSObject> | null) => {
          // Handle null as an empty array, and coerce an NSArray into JS
          // values.
          const callbackArgs = args
            ? (toJSValue(args) as JSONSerialisable[])
            : [];

          // Call back to the consumer with an array of JS values.
          data(...callbackArgs);
        });
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
        nativeArguments.push((value: NSError) => {
          // I've seen in an example that a user calls console.log(error.domain)
          // in the error handler of their RN native module's API call, so
          // returning the NSError as-is should give us the best API
          // compatibility with a React Native JS Error until we see a counter
          // case. We'll also get a nice stack trace as a result.
          data(value);
        });
        break;
      }

      case RNObjcSerialisableType.RCTPromiseResolveBlock: {
        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        nativeArguments.push((value: NSObject) => {
          // Marshal the Obj-C value back to JS to resolve to the consumer.
          resolve(toJSValue(value) as JSONSerialisable);
        });
        break;
      }

      case RNObjcSerialisableType.RCTPromiseRejectBlock: {
        // This JS function will be marshalled into an Obj-C block when
        // NativeScript passes it as a parameter to the native function.
        //
        // The callback needs to do the opposite, of calling back with a JS
        // value.
        nativeArguments.push(
          (code: NSString, message: NSString, nativeError: NSError | null) => {
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
          }
        );
        break;
      }
    }
  }
  return nativeArguments;
}

export function promisify(
  module: RCTBridgeModule,
  methodName: string,
  methodTypes: RNObjcSerialisableType[],
  args: JSValuePassableIntoObjc[]
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    module[methodName](
      ...toNativeArguments(methodTypes, args, resolve, reject)
    );
  });
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

  throw new Error(
    `Unable to marshal native value to JS: ${getClass(data)}:${data}`
  );
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
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
