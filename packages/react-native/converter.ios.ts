import { RNObjcSerialisableType } from '@ammarahm-ed/react-native-autolinking';
import { Utils } from '@nativescript/core';

//https://github.com/nativescript-community/expo-nativescript/blob/6524b9ff787c635cddf8a19799b2fcadc287e986/packages/expo-nativescript-adapter/NativeModulesProxy.ios.ts#L16
export function toJSValue(value: unknown) {
  if (value instanceof NSDictionary) {
    const obj: any = {};
    value.enumerateKeysAndObjectsUsingBlock((key: string, value: any, stop: interop.Reference<boolean>) => {
      obj[key] = toJSValue(value);
    });
    return obj;
  } else if (value instanceof NSArray) {
    const arr: any[] = [];
    value.enumerateObjectsUsingBlock((value: any, index: number, stop: interop.Reference<boolean>) => {
      arr[index] = toJSValue(value);
    });
    return arr;
  } else {
    /**
     * NSDate, NSString, NSNumber, and NSNull should all be automatically marshalled as Date, string, number, and null.
     * @see https://docs.nativescript.org/core-concepts/ios-runtime/marshalling-overview#primitive-exceptions
     *
     * NULL, Nil, and nil are all implicitly converted to null.
     * @see https://docs.nativescript.org/core-concepts/ios-runtime/marshalling-overview#null-values
     */
    return value as Date | string | number | null;
  }
}

export function toNativeArguments(argumentTypes: RNObjcSerialisableType[], args: any[], resolve?: (value: unknown) => void, reject?: (reason?: any) => void) {
  const nativeArguments = [];

  for (let i = 0; i < argumentTypes.length; i++) {
    const argType = argumentTypes[i];
    const data = args[i];
    switch (argType) {
      case RNObjcSerialisableType.array: {
        nativeArguments.push(Utils.ios.collections.jsArrayToNSArray(data));
        break;
      }
      case RNObjcSerialisableType.nonnullArray: {
        if (!data) throw new Error(`Argument at index ${i} expects a nonnull Array value`);
        nativeArguments.push(Utils.ios.collections.jsArrayToNSArray(data));
        break;
      }
      case RNObjcSerialisableType.object: {
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      }
      case RNObjcSerialisableType.nonnullObject: {
        if (!data) throw new Error(`Argument at index ${i} expects a nonnull Object value`);
        nativeArguments.push(Utils.dataSerialize(data));
        break;
      }
      case RNObjcSerialisableType.boolean:
      case RNObjcSerialisableType.string:
      case RNObjcSerialisableType.other:
      case RNObjcSerialisableType.number:
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.nonnullBoolean:
        if (Utils.isBoolean(data)) throw new Error(`Expected a boolean but got ${data}`);
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.nonnullString:
        if (Utils.isString(data)) throw new Error(`Expected a string but got ${data}`);
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.nonnullNumber:
        if (!Utils.isNumber(data)) throw new Error(`Expected a number but got ${data}`);
        nativeArguments.push(data);
        break;
      case RNObjcSerialisableType.RCTResponseSenderBlock: {
        nativeArguments.push(
          !data
            ? undefined
            : (value: unknown[]) => {
                data(...(toJSValue(value) as unknown[]));
              }
        );
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

export function promisify(method: Function, argumentTypes: RNObjcSerialisableType[], args) {
  return new Promise((resolve, reject) => {
    method(...toNativeArguments(argumentTypes, args, resolve, reject));
  });
}
