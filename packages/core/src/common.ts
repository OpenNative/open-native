export enum RNObjcSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // NSString*
  nonnullString, // nonnull NSString*
  boolean, // NSNumber* (bounded between 0 and 1, presumably)
  nonnullBoolean, // BOOL
  number, // NSNumber*
  nonnullNumber, // nonnull NSNumber*, double (and the deprecated float,
  // CGFloat, and NSInteger)
  int, // Not documented but is used by some modules, just int.
  array, // NSArray*
  nonnullArray, // nonnull NSArray*
  object, // NSDictionary*
  nonnullObject, // nonnull NSDictionary*
  RCTResponseSenderBlock,
  RCTResponseErrorBlock,
  RCTPromiseResolveBlock,
  RCTPromiseRejectBlock,
  returnType,
}

export enum RNJavaSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  string, // @Nullable String
  nonnullString, // String
  boolean, // Boolean
  nonnullBoolean,
  javaBoolean,
  nonnullJavaBoolean, // boolean
  int, // Integer (deprecated)
  nonnullInt,
  javaInteger,
  nonnullJavaInteger, // int (deprecated)
  double, // double
  nonnullDouble,
  javaDouble,
  nonnullJavaDouble, // Double
  float, // Float (deprecated)
  nonnullFloat,
  javaFloat,
  nonnullJavaFloat, // float (deprecated)
  nonnullObject, // ReadableMap
  object, // @Nullable ReadableMap
  array, // @Nullable ReadableArray
  nonnullArray, // ReadableArray
  Callback, // @Nullable Callback
  nonnullCallback, // Callback
  Promise, // Promise
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function warn(condition: any, message: string): asserts condition {
  if (!condition) {
    console.warn(message);
  }
}

export function isNullOrUndefined(value: unknown) {
  return value === null || value === undefined;
}
