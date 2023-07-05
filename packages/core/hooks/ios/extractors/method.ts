import { extractJSNameFromObjcSelector } from './js-name';

const METHOD_PARAM_REGEX = /:\((.|[\r\n])*?\).*?[a-zA-Z0-9]+/g;

/**
 * Parse the contents passed into RCT_EXPORT_METHOD or RCT_REMAP_METHOD.
 * @param contents The whole string between the macro's brackets.
 * @param exportedName The name exported to React Native consumers.
 *   - For RCT_EXPORT_METHOD, this is the portion of the method signature before
 *     the first colon (not including the return type).
 *   - For RCT_REMAP_METHOD, this is the text leading up to the comma.
 */
export function extractObjcMethodContents(
  contents: string,
  remappedName?: string,
  isSync?: boolean
) {
  /**
   * The Obj-C method signature, with all unnecessary whitespace removed.
   * @example '- (void)exportedName:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject'
   */
  const signature = `- (${isSync ? 'id' : 'void'})${contents
    .trim()
    .replace(/\s+/g, ' ') // Standardise all whitespace to a single space
    .replace(/__unused /g, '') // Remove __unused
    .replace(/\s?\*\s?/g, '*') // Collapse (NSString *) or similar to (NSString*)
    .replace(/\s*:\s*/g, ':')};`;

  /**
   * The Obj-C selector.
   * @example 'exportedName:withRejecter:'
   */
  const selector = signature
    .split(`- (${isSync ? 'id' : 'void'})`)[1]
    .replace(METHOD_PARAM_REGEX, '')
    .replace(';', '');
  /**
   * The sanitised method name that NativeScript exposes to JS.
   * @example 'exportedNameWithRejecter'
   */
  const jsName = extractJSNameFromObjcSelector(selector);

  /**
   * Everything between brackets in the method signature.
   * @example ["void", "RCTPromiseResolveBlock", "RCTPromiseRejectBlock"]
   */
  const types = [...signature.matchAll(/\(.*?\)/g)].map((match) =>
    match[0].replace(/[()]/g, '')
  );

  const methodName = contents.split(':')[0].trim();

  /**
   * The method name that would be exposed to React Native. These two macro
   * calls both give the following output:
   *
   * {
   *   "selector": "executeQuery:parameters:",
   *   "jsName": "executeQueryParameters",
   *   "methodName": "executeQuery",
   * }
   *
   * ... but their exportedName differs:
   *
   * RCT_EXPORT_METHOD(executeQuery:(NSString *)query parameters:(NSDictionary *)parameters)
   * { "exportedName": "executeQuery" }
   *
   * RCT_REMAP_METHOD(executeQueryWithParameters, executeQuery:(NSString *)query parameters:(NSDictionary *)parameters)
   * { "exportedName": "executeQueryWithParameters" }
   *
   * @example 'executeQueryWithParameters'
   */
  const exportedName = remappedName || methodName;

  return {
    exportedName,
    jsName,
    selector,
    signature,
    types,
    sync: isSync,
  };
}
