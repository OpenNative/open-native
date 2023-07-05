import { ModuleMap, writeFile } from '../common';

const JavaTypeToTSTypeMap = {
  0: 'any', // Anything we fail to parse!
  1: 'any', // void
  2: 'string', // @Nullable String
  3: 'string', // String
  4: 'boolean', // Boolean
  5: 'boolean', // boolean
  6: 'number', // Integer (deprecated)
  7: 'number', // int (deprecated)
  8: 'number', // double
  9: 'number', // Double
  10: 'number', // Float (deprecated)
  11: 'number', // float (deprecated)
  12: 'number', // ReadableMap
  13: 'any', // @Nullable ReadableMap
  14: 'any[]', // @Nullable ReadableArray
  15: 'any[]', // ReadableArray
  16: ' any', // @Nullable Callback
  17: 'any', // Callback
  18: 'any', // Promise
};

/**
 * Generates a ViewManagers interface with all registered ViewManagers & their prop types
 * and writes them to `@open-native/core/src/android/view-manager-types.ts`.
```ts
export interface ViewManagers {
  "BackgroundView":{
      color: string;
  }
}
```
 * @returns 
 */
export async function writeViewManagerTypes({
  modules,
  outputViewManagerTypesPath,
}: {
  modules: ModuleMap;
  outputViewManagerTypesPath: string;
}) {
  const interfaces = {};
  for (const module in modules) {
    if (!modules[module].v) continue;
    const methods = modules[module].m;
    const props = Object.keys(methods).map(
      (m) =>`
/**
${methods[m].nd}
*/
${methods[m].p}: ${JavaTypeToTSTypeMap[methods[m].t[2]] || 'any'};`
    );
    interfaces[module] = props;
  }

  const output = `
export interface ViewManagers {
  ${Object.keys(interfaces)
    .map(
      (module) => `"${module}":{
      ${interfaces[module].join('\n')}
  }`
    )
    .join('\n')}
}`;

  return await writeFile(outputViewManagerTypesPath, output, {
    encoding: 'utf-8',
  });
}
