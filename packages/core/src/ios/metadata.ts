import { Utils } from '@nativescript/core';
import { RNObjcSerialisableType } from '../common';

export type ModuleMetadata = {
  methods: {
    [name: string]: {
      selector: string;
      types: number[];
      sync: boolean;
    };
  };
  props: {
    [name: string]: {
      type: string;
      jsType: number;
      keyPath: string;
      customSetter: string;
      setter: string;
      getter: string;
      key: string;
      defaultValue?: any;
      setDefaultValue?: boolean;
    };
  };
};

export function parseModuleMetadata(className: string): ModuleMetadata {
  const data = Utils.dataDeserialize(
    global.reactNativeBridgeIOS.getModuleMethodObjcNames(className)
  );

  const methods = data.methods;
  const props = data.props;
  const metadata = {
    methods: {},
    props: {},
  };
  for (const method in methods) {
    const parts = method.matchAll(/\w+(\s+|.):/gm);
    let str = '';
    for (const part of parts) {
      str += part[0].replace(/\s+/g, '');
    }
    if (!str) str = method;
    metadata.methods[methods[method].jsName || str.split(':')[0]] = {
      selector: str,
      types: [...method.matchAll(/\(.*?\)/g)]
        .map((match) => match[0].replace(/[()]/g, ''))
        .map((type) => {
          return extractMethodParamTypes(type.trim());
        }),
      sync: methods[method].isSync,
    };
  }
  for (const prop in props) {
    props[prop].jsType = extractMethodParamTypes(props[prop].type);
    props[prop].key = props[prop].keyPath?.includes('.')
      ? props[prop].keyPath.split('.')[1]
      : undefined;
  }
  metadata.props = props;
  return metadata;
}

export function extractMethodParamTypes(
  objcType: string
): RNObjcSerialisableType {
  // Search for nullability annotations as per:
  // https://developer.apple.com/swift/blog/?id=25:
  // We'll accordingly search for:
  // 1) When 'nonnull' immediately follows the opening bracket for the arg;
  // 2) If there's a '_Nonnull' token anywhere within the type.
  // We won't bother distinguishing params that have a name that includes the
  // text '_Nonnull'. Hopefully that never comes up.
  //
  // We don't bother searching for nullable annotations, because that's our
  // default nullability for each type that supports nullability.
  const nonnull =
    /^nonnull\s+/.test(objcType.trim()) ||
    objcType.toLowerCase().includes('_Nonnull');

  const splitBeforeGeneric = objcType.split('<')[0];

  if (splitBeforeGeneric.includes('NSString')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullString
      : RNObjcSerialisableType.string;
  }
  if (splitBeforeGeneric.includes('NSNumber')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullNumber
      : RNObjcSerialisableType.number;
  }

  if (splitBeforeGeneric.includes('NSDictionary')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullObject
      : RNObjcSerialisableType.object;
  }
  if (splitBeforeGeneric.includes('NSArray')) {
    return nonnull
      ? RNObjcSerialisableType.nonnullArray
      : RNObjcSerialisableType.array;
  }

  switch (objcType) {
    case 'id':
      return RNObjcSerialisableType.returnType;
    case 'void': // This is only of relevance for parsing the return type.
      return RNObjcSerialisableType.void;
    case 'double':
      return RNObjcSerialisableType.double;
    case 'float': // deprecated
    return RNObjcSerialisableType.float;
    case 'CGFloat': // deprecated
    return RNObjcSerialisableType.CGFloat;
    case 'NSInteger': // deprecated
      return RNObjcSerialisableType.NSInteger;
    case 'BOOL *':
    case 'BOOL':
      return RNObjcSerialisableType.nonnullBoolean;
    case 'nonnull RCTResponseSenderBlock':
    case 'RCTResponseSenderBlock':
      return RNObjcSerialisableType.RCTResponseSenderBlock;
    case 'nonnull RCTResponseErrorBlock':
    case 'RCTResponseErrorBlock':
      return RNObjcSerialisableType.RCTResponseErrorBlock;
    case 'nonnull RCTPromiseResolveBlock':
    case 'RCTPromiseResolveBlock':
      return RNObjcSerialisableType.RCTPromiseResolveBlock;
    case 'nonnull RCTPromiseRejectBlock':
    case 'RCTPromiseRejectBlock':
      return RNObjcSerialisableType.RCTPromiseRejectBlock;
    case 'int':
      return RNObjcSerialisableType.int;
    case 'RCTDirectEventBlock':
    case 'RCTBubblingEventBlock':
    case 'RCTCapturingEventBlock':
      return RNObjcSerialisableType.RCTEventType;
    default:
      return RNObjcSerialisableType.other;
  }
}

let MODULE_CLASS_NAMES = [];

export function getModuleClasses() {
  if (MODULE_CLASS_NAMES.length) return MODULE_CLASS_NAMES;
  return (MODULE_CLASS_NAMES = Utils.ios.collections.nsArrayToJSArray(
    RCTGetModuleClasses().allKeys
  ));
}
