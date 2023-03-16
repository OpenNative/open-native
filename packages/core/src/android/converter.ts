import { Utils } from '@nativescript/core';
import {
  numberHasDecimals,
  numberIs64Bit,
} from '@nativescript/core/utils/types';
import {
  assert,
  isNullOrUndefined,
  RNJavaSerialisableType,
  warn,
} from '../common';
import {
  BaseJavaModule,
  Callback,
  RCTPromise,
  ReadableArray,
  ReadableMap,
  WritableMap,
  WriteableArray,
} from './types';

function createJSCallback(callback: (...args: any[]) => void) {
  return new com.facebook.react.bridge.Callback({
    invoke: (args: androidNative.Array<any> | null) => {
      // Handle null as an empty array, and coerce an NSArray into JS
      // values.
      const callbackArgs = [];
      if (args) {
        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          callbackArgs.push(toJSValue(arg));
        }
      }

      // Call back to the consumer with an array of JS values.
      callback(...callbackArgs);
    },
  });
}

function createJSPromise(resolve, reject) {
  return new com.facebook.react.bridge.Promise({
    resolve(value) {
      resolve(toJSValue(value) as JSONSerialisable);
    },
    reject(...args: any[]) {
      //  void reject(String message);
      if (args.length === 1 && args[0] instanceof java.lang.String) {
        reject(new Error(toJSValue(args[0]) as string));
        return;
      }

      //  void reject(Throwable throwable);
      if (args.length === 1 && args[0] instanceof java.lang.Throwable) {
        const throwable = args[0];
        reject({
          message: toJSValue(throwable.getMessage()),
          stack: toJSValue(throwable.getStackTrace()),
        });
        return;
      }

      //  void reject(String code, Throwable throwable);
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.Throwable
      ) {
        const throwable = args[1];
        reject({
          code: toJSValue(args[0]),
          message: toJSValue(throwable.getMessage()),
          stack: toJSValue(throwable.getStackTrace()),
        });
        return;
      }

      //  void reject(String code, String message);
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.String
      ) {
        reject({
          code: toJSValue(args[0]),
          message: toJSValue(args[1]),
        });
        return;
      }

      // void reject(String code, String message, Throwable throwable);
      if (
        args.length === 3 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.String &&
        args[2] instanceof java.lang.Throwable
      ) {
        reject({
          code: toJSValue(args[0]),
          message: toJSValue(args[1]),
          stack: toJSValue(args[2].getStackTrace()),
        });
        return;
      }

      //  void reject(Throwable throwable, WritableMap userInfo);
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.Throwable &&
        args[1] instanceof com.facebook.react.bridge.WritableMap
      ) {
        reject({
          message: toJSValue(args[0].getLocalizedMessage()),
          userInfo: toJSValue(args[1]),
        });
        return;
      }

      // void reject(String code, @NonNull WritableMap userInfo);
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof com.facebook.react.bridge.WritableMap
      ) {
        reject({
          code: toJSValue(args[0]),
          userInfo: toJSValue(args[1]),
        });
        return;
      }

      //void reject(String code, Throwable throwable, WritableMap userInfo);
      if (
        args.length === 3 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.Throwable &&
        args[2] instanceof com.facebook.react.bridge.WritableMap
      ) {
        reject({
          code: toJSValue(args[0]),
          stack: toJSValue(args[1].getStackTrace()),
          userInfo: toJSValue(args[2]),
        });
        return;
      }

      // void reject(String code, String message, @NonNull WritableMap userInfo);
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.String &&
        args[2] instanceof com.facebook.react.bridge.WritableMap
      ) {
        reject({
          code: toJSValue(args[0]),
          message: toJSValue(args[1]),
          userInfo: toJSValue(args[2]),
        });
        return;
      }
      //  void reject(String code, String message, Throwable throwable, WritableMap userInfo)
      if (
        args.length === 2 &&
        args[0] instanceof java.lang.String &&
        args[1] instanceof java.lang.String &&
        args[2] instanceof java.lang.Throwable &&
        args[3] instanceof com.facebook.react.bridge.WritableMap
      ) {
        reject({
          code: toJSValue(args[0]),
          message: toJSValue(args[1]),
          userInfo: toJSValue(args[2]),
          stack: toJSValue(args[2].getStackTrace()),
        });
        return;
      }
    },
  });
}

export function toNativeArguments(
  methodTypes: RNJavaSerialisableType[],
  args: JSValuePassableIntoJava[],
  resolve?: (value: JSONSerialisable) => void,
  reject?: (reason: Error) => void
): RNNativeModuleMethodArg[] {
  const nativeArguments: RNNativeModuleMethodArg[] = [];

  assert(
    methodTypes.length,
    'Method signature empty, so unable to call native method.'
  );

  const argumentTypes = methodTypes.slice(1);

  // I don't think this check should be added,
  // arguments will not be equal to argument types as
  // we create promises later on and append them
  // to native arguments. Maybe it can check argument length
  // but after removing Promise/Callback from argumentTypes then
  // comparing the length or check arguments length before returning
  // native arguments after generation?

  // assert(
  //   argumentTypes.length === args.length,
  //   `Expected ${argumentTypes.length} arguments, but got ${args.length}. Note that Obj-C does not support optional arguments.`
  // );

  for (let i = 0; i < argumentTypes.length; i++) {
    const argType = argumentTypes[i];
    const data = args[i];

    // assert(
    //   typeof data !== 'undefined',
    //   `Unexpected \`undefined\` value passed in at index ${i} for argument type "${RNJavaSerialisableType[argType]}". Note that Obj-C does not have an equivalent to undefined.`
    // );

    // if (
    //   argType === RNJavaSerialisableType.nonnullArray ||
    //   argType === RNJavaSerialisableType.nonnullBoolean ||
    //   argType === RNJavaSerialisableType.nonnullDouble ||
    //   argType === RNJavaSerialisableType.nonnullFloat ||
    //   argType === RNJavaSerialisableType.nonnullInt ||
    //   argType === RNJavaSerialisableType.nonnullObject ||
    //   argType === RNJavaSerialisableType.nonnullString ||
    //   argType === RNJavaSerialisableType.nonnullCallback
    // ) {
    //   assert(
    //     data !== null,
    //     `Unexpectedly got null for nonnull argument type "${RNJavaSerialisableType[argType]}."`
    //   );
    // }

    switch (argType) {
      case RNJavaSerialisableType.other: {
        throw new Error(
          `Unexpected type 'other' at index ${i} - the autolinker must have failed to parse the native module.`
        );
      }

      case RNJavaSerialisableType.array:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullArray: {
        assert(
          data === null || Array.isArray(data),
          `Argument at index ${i} expected an Array value, but got ${data}`
        );

        nativeArguments.push(toNativeValue(data, false) as JavaJSONEquivalent);
        break;
      }

      case RNJavaSerialisableType.object:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullObject: {
        assert(
          data === null || data?.constructor === Object,
          `Argument at index ${i} expected an object value, but got ${data}`
        );

        nativeArguments.push(
          toNativeValue(
            data as JSONSerialisable | null,
            false
          ) as JavaJSONEquivalent
        );
        break;
      }

      case RNJavaSerialisableType.boolean:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
        // nullable booleans are java.lang.Booleans
        // the runtime sometimes doesn't marshall primitives to their objects
        nativeArguments.push(toNativeValue(data, true));
        break;
      case RNJavaSerialisableType.nonnullBoolean:
        assert(
          typeof data === 'boolean',
          `Argument at index ${i} expected a boolean, but got ${data}`
        );

        // booleans are auto-marshalled to BOOL.
        nativeArguments.push(data);
        break;

      case RNJavaSerialisableType.string:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullString:
        assert(
          typeof data === 'string',
          `Argument at index ${i} expected a string, but got ${data}`
        );

        // strings are auto-marshalled to NSString.
        nativeArguments.push(data);
        break;

      case RNJavaSerialisableType.int:
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );
        nativeArguments.push(new java.lang.Integer(data));
        break;
      case RNJavaSerialisableType.nonnullInt:
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );
        nativeArguments.push(data);
        break;
      case RNJavaSerialisableType.float:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(float(0));
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullFloat:
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );
        nativeArguments.push(float(data));
        break;
      case RNJavaSerialisableType.double:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(0);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullDouble:
        assert(
          typeof data === 'number',
          `Argument at index ${i} expected a number, but got ${data}`
        );
        nativeArguments.push(double(data));
        break;
      case RNJavaSerialisableType.Callback:
        if (isNullOrUndefined(data)) {
          nativeArguments.push(null);
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case RNJavaSerialisableType.nonnullCallback: {
        assert(
          typeof data === 'function',
          `Argument at index ${i} expected a function, but got ${data}`
        );
        nativeArguments.push(createJSCallback(data));
        break;
      }

      case RNJavaSerialisableType.Promise: {
        nativeArguments.push(createJSPromise(resolve, reject));
        break;
      }
    }
  }

  /**
   * Instead of asserting, we can show a warning here.
   */
  warn(
    argumentTypes.length === nativeArguments.length,
    `Expected ${argumentTypes.length} arguments, but got ${args.length}.`
  );
  return nativeArguments;
}

export function promisify(
  module: BaseJavaModule,
  methodName: string,
  methodTypes: RNJavaSerialisableType[],
  args: JSValuePassableIntoJava[]
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    try {
      module[methodName](
        ...toNativeArguments(methodTypes, args, resolve, reject)
      );
    } catch (e) {
      reject(e);
    }
  });
}

export type JSONSerialisable =
  | string
  | boolean
  | number
  | null
  | JSONSerialisable[]
  | { [key: string]: JSONSerialisable };

export type RNNativeModuleArgType = JSONSerialisable;

/**
 * All the JS types that an Java type received from NativeScript could be
 * marshalled into. Essentially the same list as React Native's supported types
 * for native modules (all JSON-serialisable types and
 * Promise/Callback), but adding Date and support for any shape of function.
 */
export type JSValuePassableIntoJava =
  | JSONSerialisable
  | Date
  | ((...args: unknown[]) => unknown)
  | JSValuePassableIntoJava[]
  | { [key: string]: JSValuePassableIntoJava };

/**
 * Checks whether a value (ostensibly from Java/Kotlin) is a JS type already.
 */
function isJSValue(data: unknown): data is JSValuePassableIntoJava {
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
 * JS value, will return it as-is. If passed a mixed array (e.g. ReadableMap[]) or
 * mixed record (e.g. Record<string, ReadableMap>), it'll create a new object that
 * is a deep JS value.
 *
 * TODO: implement 'strict' mode as in toNativeValue() to make sure we're not
 * unnecessarily marshalling between, say, NSDate and Date when the runtime
 * would do it for us anyway.
 */
export function toJSValue(
  data:
    | java.lang.Object
    | androidNative.Array<any>
    | JSValuePassableIntoJava
    | ReadableArray
    | ReadableMap
    | WritableMap
    | WriteableArray
    | undefined
): JSValuePassableIntoJava {
  if (isJSValue(data)) {
    return data;
  }

  /**
   * Handle the case of a mixed array (e.g. Object[]).
   */
  if (Array.isArray(data)) {
    return data.map((item) => toJSValue(item));
  }

  /**
   * Handle the case of a mixed record (e.g. Record<string, Object>).
   */
  if (data?.constructor === Object) {
    const obj: { [key: string]: JSValuePassableIntoJava } = {};
    for (const key in data as unknown as Record<string, unknown>) {
      obj[key] = toJSValue(data[key]);
    }
    return obj;
  }

  // That's all of the cases of accidental JS value inputs I can think of out of
  // the way, so now we continue onto Maps & Arrays to marshal.

  if (
    data instanceof com.facebook.react.bridge.ReadableMap ||
    data instanceof com.facebook.react.bridge.WritableMap ||
    data instanceof com.facebook.react.bridge.WritableNativeMap
  ) {
    const obj: { [key: string]: JSValuePassableIntoJava } = {};

    const map = data.toHashMap();
    const length = map.size();
    const keysArray = map.keySet().toArray();
    for (let i = 0; i < length; i++) {
      const nativeKey = keysArray[i];
      obj[nativeKey] = toJSValue(map.get(nativeKey));
    }
    return obj;
  }

  if (
    data instanceof com.facebook.react.bridge.ReadableArray ||
    data instanceof com.facebook.react.bridge.WritableArray ||
    data instanceof com.facebook.react.bridge.WritableNativeArray
  ) {
    const array = [];
    const len = data.size();
    const javaArray = data.toArrayList();
    for (let i = 0; i < len; i++) {
      array[i] = toJSValue(javaArray.get(i));
    }
    return array;
  }
  // TODO: check if there is an equvilent marshalling needed for android?
  // if (data instanceof NSDate) {
  //   return new Date(data.timeIntervalSince1970 * 1000);
  // }

  if (
    data instanceof java.lang.Integer ||
    data instanceof java.lang.Float ||
    data instanceof java.lang.Double ||
    data instanceof java.lang.String
  ) {
    return Utils.dataDeserialize(data);
  }

  if (data === null) return null;
  if (data === undefined) return undefined;

  // Instead of throwing, maybe we should let the runtime handle any
  // other types of data that might be coming through?
  return Utils.dataDeserialize(data);

  // throw new Error(
  //   `Unable to marshal native value to JS: ${getClass(data)}:${data}`
  // );
}

/**
 * Converts the given value (where necessary) into a value that can be passed
 * directly into an Java/Kotlin function.
 *
 * The 'where necessary' refers firstly to the fact that NativeScript supports
 * directly passing certain JS values directly into native function calls,
 * marshalling them into equivalent java.lang.Object under-the-hood:
 *
 * ... and secondly, to the fact that sometimes you won't be sure whether a
 * native API will return you a JS string or an NSString. If toNativeValue() is
 * passed a value that is already an NSObject, it will be left as-is.
 *
 * @param data A JSON-serializable JS value, or a JS function, or Date, or
 *   undefined.
 * @param strict A boolean expressing the marshalling strategy for JS numbers
 * and strings, given that they may be passed to native functions as-is.
 * - true: all strings and numbers are always coerced to java.lang.String and java.lang.Integer.
 * - false: all strings and non-64-bit numbers that are integers are preserved
 *   as JS values, so that you can delegate to the runtime's auto-marshalling.
 * This is handy if you're not sure whether you have a JS number or an java.lang.Integer,
 * but want to use java.lang.Integer APIs on the return value without additional checks.
 */
export function toNativeValue<T extends boolean>(
  data: JSValuePassableIntoJava | java.lang.Object | undefined,
  strict: T
):
  | java.lang.Object
  | boolean
  | null
  | ReadableArray
  | ReadableMap
  | WritableMap
  | WriteableArray
  | ((...args: unknown[]) => unknown)
  | (T extends false ? string | number : never) {
  /**
   * If we were passed a java Object by accident, return it as-is.
   */
  if (data instanceof java.lang.Object) {
    return data;
  }

  /**
   * JS functions are coerced to blocks:
   */
  if (typeof data === 'function') {
    return data;
  }

  /**
   * Java has no equivalent of an undefined/optional function
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
      return new java.lang.String(data);
    }
    if (typeof data === 'boolean') {
      return new java.lang.Boolean(data)
    }
  }

  // Convert array to a ReadableArray
  if (Array.isArray(data)) {
    const writableArray = com.facebook.react.bridge.Arguments.createArray();
    for (const value of data) {
      if (value === null || value === undefined) {
        writableArray.pushNull();
        continue;
      }
      if (Array.isArray(value)) {
        writableArray.pushArray(
          toNativeValue(value, false) as unknown as ReadableArray
        );
        continue;
      }
      switch (typeof value) {
        case 'object':
          writableArray.pushMap(
            toNativeValue(value, false) as unknown as ReadableMap
          );
          break;
        case 'boolean':
          writableArray.pushBoolean(toNativeValue(value, false) as boolean);
          break;
        case 'string':
          writableArray.pushString(toNativeValue(value, false) as string);
          break;
        case 'number':
        case 'bigint':
          writableArray.pushDouble(toNativeValue(value, false) as number);
          break;
        case 'function':
          writableArray.pushNull();
      }
    }
    return writableArray;
  }

  // Convert array to a ReadableMap
  // This isn't ideal, we might come back later
  // and create a way to make js objects from java
  // & have all objects/arrays in JS that can be returned
  // elsewhere. It should be fast as the values inside each
  // ReadableMap//ReadableArray would just be JS Values,
  // All we would call is writable.getMap().
  // It should be really fast compared to now
  // where we write values to JS / then to Java
  // And the same way we do it on return from Java too.
  // But for now let's stick to react native way & get it working!
  if (typeof data === 'object') {
    const writableMap = com.facebook.react.bridge.Arguments.createMap();
    for (const key in data) {
      if (data[key] === null || data[key] === undefined)
        writableMap.putNull(key);
      if (Array.isArray(data[key])) {
        writableMap.putArray(
          key,
          toNativeValue(data[key], false) as unknown as ReadableArray
        );
        continue;
      }
      switch (typeof data[key]) {
        case 'object':
          writableMap.putMap(
            key,
            toNativeValue(data[key], false) as unknown as ReadableMap
          );
          break;
        case 'boolean':
          writableMap.putBoolean(
            key,
            toNativeValue(data[key], false) as boolean
          );
          break;
        case 'string':
          writableMap.putString(key, toNativeValue(data[key], false) as string);
          break;
        case 'number':
        case 'bigint':
          writableMap.putDouble(key, toNativeValue(data[key], false) as number);
          break;
        case 'function':
          writableMap.putNull(key);
      }
    }
    return writableMap as ReadableMap;
  }

  if (!numberHasDecimals(data as number) && !numberIs64Bit(data as number)) {
    return data as never;
  }

  /**
   * NativeScript supports passing various types to native functions directly as
   * JS values. Utils.dataSerialize() sensibly handles all remaining types that
   * we haven't handled above.
   */
  return Utils.dataSerialize(data);
}

export type JavaJSONEquivalent =
  | java.lang.String
  | java.lang.Number
  | null
  | boolean
  | ReadableMap
  | ReadableArray;

/**
 * All the argument types that can be passed into a React Native native API
 * call by NativeScript. Some JS primitives are included because NativeScript
 * supports auto-marshalling.
 */
export type RNNativeModuleMethodArg =
  | JavaJSONEquivalent
  | number
  | string
  | Callback
  | RCTPromise;
