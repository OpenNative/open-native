import { RNObjcSerialisableType } from '@ammarahm-ed/react-native-autolinking/RNObjcSerialisableType';

export type TModuleMethodsType = {
  [name: string]: {
    j: string;
    t: RNObjcSerialisableType[];
  };
};

export type TNativeModuleMap = {
  [name: string]: TModuleMethodsType;
};

export function getModuleMethods(module: RCTBridgeModule) {
  const keys = [];
  for (const key in module) keys.push(key);
  return keys;
}

export function isPromise(moduleMethods: TModuleMethodsType, methodName: string) {
  return moduleMethods[methodName].t.indexOf(RNObjcSerialisableType.RCTPromiseResolveBlock) > -1;
}
