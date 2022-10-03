import { RNObjcSerialisableType } from '@ammarahm-ed/react-native-autolinking/RNObjcSerialisableType';
import { Utils } from '@nativescript/core';

type ReactNativePrimitive = Date | string | number | null | ReactNativePrimitive[] | { [key: string]: ReactNativePrimitive };

// https://github.com/nativescript-community/expo-nativescript/blob/6524b9ff787c635cddf8a19799b2fcadc287e986/packages/expo-nativescript-adapter/NativeModulesProxy.ios.ts#L16
export function toJSValue(value: unknown): ReactNativePrimitive {
  if (value instanceof NSDictionary) {
    const obj: ReactNativePrimitive = {};
    value.enumerateKeysAndObjectsUsingBlock((key: string, value: unknown) => {
      obj[key] = toJSValue(value);
    });
    return obj;
  }

  if (value instanceof NSArray) {
    const arr: ReactNativePrimitive[] = [];
    value.enumerateObjectsUsingBlock((value: unknown) => arr.push(toJSValue(value)));
    return arr;
  }

  /**
   * NSDate, NSString, NSNumber, and NSNull should all be automatically marshalled as Date, string, number, and null.
   * @see https://docs.nativescript.org/core-concepts/ios-runtime/marshalling-overview#primitive-exceptions
   *
   * NULL, Nil, and nil are all implicitly converted to null.
   * @see https://docs.nativescript.org/core-concepts/ios-runtime/marshalling-overview#null-values
   */
  return value as Date | string | number | null;
}

type RCTResponseSenderBlockType = (...args: unknown[]) => void;
type RCTResponseErrorBlockType = (value: NSError) => void;
type RCTPromiseBlockType = (value: unknown) => void;
type BlockTypes = RCTResponseSenderBlockType | RCTResponseErrorBlockType | RCTPromiseBlockType;

type NativeArg = NSObject | BlockTypes;

export function toNativeArguments(argumentTypes: RNObjcSerialisableType[], args: unknown[], resolve?: (value: unknown) => void, reject?: (reason?: unknown) => void): NativeArg[] {
  const nativeArguments: NativeArg[] = [];

  for (let i = 0; i < argumentTypes.length; i++) {
    const argType = argumentTypes[i];
    const data = args[i];
    switch (argType) {
      case RNObjcSerialisableType.array: {
        nativeArguments.push(Utils.ios.collections.jsArrayToNSArray(data as unknown[]));
        break;
      }
      case RNObjcSerialisableType.nonnullArray: {
        if (!data) throw new Error(`Argument at index ${i} expects a nonnull Array value`);
        nativeArguments.push(Utils.ios.collections.jsArrayToNSArray(data as unknown[]));
        break;
      }
      case RNObjcSerialisableType.object: {
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      }
      case RNObjcSerialisableType.nonnullObject: {
        if (data === null) throw new Error(`Argument at index ${i} expects a nonnull Object value`);
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      }
      case RNObjcSerialisableType.boolean:
      case RNObjcSerialisableType.string:
      case RNObjcSerialisableType.other:
      case RNObjcSerialisableType.number:
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      case RNObjcSerialisableType.nonnullBoolean:
        if (!Utils.isBoolean(data)) throw new Error(`Expected a boolean but got ${data}`);
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.nonnullString:
        if (!Utils.isString(data)) throw new Error(`Expected a string but got ${data}`);
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.nonnullNumber:
        if (!Utils.isNumber(data)) throw new Error(`Expected a number but got ${data}`);
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      case RNObjcSerialisableType.RCTResponseSenderBlock: {
        if (!data) {
          nativeArguments.push(null);
          break;
        }
        if (typeof data !== 'function') throw new Error(`Expected a function, but got ${data}`);
        nativeArguments.push((...args: unknown[]) => {
          data(...args.map((arg) => toJSValue(arg)));
        });
        break;
      }
      case RNObjcSerialisableType.RCTResponseErrorBlock: {
        nativeArguments.push(
          !data
            ? undefined
            : (value: NSError) => {
                data(toJSValue(value.userInfo));
              }
        );
        break;
      }
      case RNObjcSerialisableType.RCTPromiseResolveBlock: {
        nativeArguments.push((value: unknown) => {
          resolve(toJSValue(value));
        });
        break;
      }
      case RNObjcSerialisableType.RCTPromiseRejectBlock: {
        nativeArguments.push((reason: unknown) => {
          reject(toJSValue(reason));
        });
        break;
      }
      default:
        break;
    }
  }
  return nativeArguments;
}

export function promisify(module: RCTBridgeModule, methodName: string, argumentTypes: RNObjcSerialisableType[], args: unknown[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    module[methodName](...toNativeArguments(argumentTypes, args, resolve, reject));
  });
}
