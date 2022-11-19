/**
 * Converts the Obj-C method selector into the JS-safe property name that the
 * NativeScript metadata generator would convert the selector into.
 * @param selector the Obj-C method selector, e.g. 'show:withRejecter:'
 * @example 'showWithRejecter'
 */
export function extractJSNameFromObjcSelector(selector: string): string {
  const tokens: string[] = selector.split(' ').filter((param) => param !== '');
  let jsName = tokens[0].trim();
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i].trim();
    tokens[i] = `${token[0].toUpperCase()}${token.slice(1)}`;
    jsName += tokens[i];
  }
  return jsName;
}
