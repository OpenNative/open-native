import { RNObjcSerialisableType } from '@ammarahm-ed/react-native-autolinking/RNObjcSerialisableType';

export type TModuleMethodsType = {
  [name: string]: {
    jsName: string;
    types: RNObjcSerialisableType[];
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
  return moduleMethods[methodName].types.indexOf(RNObjcSerialisableType.RCTPromiseResolveBlock) > -1;
}
