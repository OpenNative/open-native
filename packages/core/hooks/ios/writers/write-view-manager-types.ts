import {
  ModuleNamesToMethodDescriptions,
  RNObjcSerialisableType,
  writeFile,
} from '../common';

function getJSEventName(eventName: string) {
  let jsEventName = eventName;
  if (jsEventName.startsWith('top'))
    jsEventName = jsEventName.replace('top', '');
  if (jsEventName.startsWith('on')) jsEventName = jsEventName.replace('on', '');
  jsEventName = jsEventName[0].toLowerCase() + jsEventName.slice(1);

  return jsEventName;
}

const ObjCTypeToTSTypeMap = {
  0: 'any',
  1: 'any',
  2: 'string',
  3: 'string',
  4: 'boolean',
  5: 'boolean',
  6: 'number',
  7: 'number',
  8: 'number',
  9: 'number',
  10: 'number',
  11: 'number',
  12: 'number',
  13: 'any[]',
  14: 'any',
  15: ' any',
  16: 'any',
  17: 'any',
  18: 'any',
  19: 'any',
  20: 'any',
  21: 'any',
  22: 'any',
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
  modules: ModuleNamesToMethodDescriptions;
  outputViewManagerTypesPath: string;
}) {
  const interfaces = {};
  for (const module in modules) {
    if (!modules[module].viewProps || modules[module].viewProps.length === 0)
      continue;
    const viewProps = modules[module].viewProps;

    const props: string[] = [];
    const events: string[] = [];
    for (const prop of viewProps) {
      if (prop.type !== RNObjcSerialisableType.RCTEventType) {
        props.push(`${prop.name}: ${ObjCTypeToTSTypeMap[prop.type] || 'any'}`);
      } else {
        events.push(getJSEventName(prop.name));
      }
    }

    interfaces[module] = {
      props,
      events,
    };
  }

  const output = `
export interface ViewManagers {
  ${Object.keys(interfaces)
      .map(
        (module) => `"${module}":{
      ${interfaces[module].props.join('\n')}

  viewEventNames: ${interfaces[module].events.length === 0
            ? '""'
            : interfaces[module].events.map((event) => `"${event}"`).join(' | ')
          }
  }`
      )
      .join('\n')}
}`;

  return await writeFile(outputViewManagerTypesPath, output, {
    encoding: 'utf-8',
  });
}
