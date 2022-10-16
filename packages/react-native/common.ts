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
  array, // NSArray*
  nonnullArray, // nonnull NSArray*
  object, // NSDictionary*
  nonnullObject, // nonnull NSDictionary*
  RCTResponseSenderBlock,
  RCTResponseErrorBlock,
  RCTPromiseResolveBlock,
  RCTPromiseRejectBlock,
}

export enum RNJavaSerialisableType {
  other, // Anything we fail to parse!
  void, // void
  nonnullString, // String
  boolean, // Boolean
  nonnullBoolean, // boolean
  int, // Integer (deprecated)
  nonnullInt, // int (deprecated)
  double, // double
  nonnullDouble, // Double
  float, // Float (deprecated)
  nonnullFloat, // float (deprecated)
  nonnullArray, // ReadableArray
  nonnullObject, // ReadableMap
  Callback, // Callback
  Promise, // Promise
}
