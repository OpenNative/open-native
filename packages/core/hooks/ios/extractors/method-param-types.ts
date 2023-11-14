import { RNObjcSerialisableType } from '../common';

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
    case 'BOOL*':
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
    case 'RCTDirectEventBlock':
    case 'RCTBubblingEventBlock':
    case 'RCTCapturingEventBlock':
      return RNObjcSerialisableType.RCTEventType;
    case 'int':
      return RNObjcSerialisableType.int;
    default:
      return RNObjcSerialisableType.other;
  }
}
