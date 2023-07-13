---
title: API Reference
---

# API Reference

Open Native implements a small subset of React Native API that is enough to run Native Modules built for React Native. Usually you won't be interacting with these APIs and just be using the exposed interface from the native modules you install in your project.

### `NativeModules`

The `NativeModules` object holds references to all the native modules that have been initialized on app launch. This is used by react native modules javascript code to access native methods.

For example the Linking Core module uses the following two modules:

```js
// Importing from `react-native` because it is alaised by `open-native`.
// You can do `import { NativeModules } from "open-native" and
// it will work the same.
import { NativeModules } from 'react-native';

const NativeLinkingManager = NativeModules.LinkingManager;
const NativeIntentAndroid = NativeModules.IntentAndroid;
```

### `DeviceEventEmitter`

It is another core react native module that is used by Native Modules to emit events to JavaScript.

```js
import { DeviceEventEmitter } from 'react-native';

//To emit an event:

DeviceEventEmitter.emit('MyEvent', { data: 'data' });

// And to listen to events coming from Native Modules,

const sub = DeviceEventEmitter.addEventListener('MyEvent', (event) => {
  console.log(event);
});

// Remove the subscription on unmount
sub?.remove();
```

Usually react native modules will wrap these into a nicer API but sometimes you have to use raw events.

### `Linking`

Linking gives you a general interface to interact with both incoming and outgoing app links. You can [check out the React Native docs](https://reactnative.dev/docs/linking) on it's usage.

### `Platform.OS`

Gets the current OS, ios or android.

```js
import { Platform } from 'react-native';

console.log(Platform.OS);
```

### `Platform.select({...})`

A utility function that selects platform specific values automatically.

```js
import { Platform } from 'react-native';

const config = Platform.select({
  ios: {..},
  android: {..},
});
```

### `Alert`

Launches an alert dialog with the specified title and message. You can [check out the React Native docs](https://reactnative.dev/docs/alert) for it's usage.

### `AppRegistry.registerHeadlessTask`

Register a headless task. A headless task is a bit of code that runs without a UI. This is a way to run tasks in JavaScript while your app is in the background. It can be used, for example, to sync fresh data, handle push notifications, or play music.
Usually used by native modules that do work in background or wake your app to run some JS code.

### `Dimensions.get`

Gets the current dimensions related data. See [react-native](https://reactnative.dev/docs/dimensions#get) docs on how to use this method.

### `init`

Open Native does not load modules until the first request to import a NativeModule takes place. If you want to eagerly load all modules metadata, call this method in `app.js`.

```js
import { init } from '@open-native/core';
init();
```

Remember that this only loads the metadata, the NativeModules are always lazily loaded.

### `loadModulesForPackage (android only)`

Native modules on android ship in small ReactPackages. Each package can have multiple modules. Open Native by default does not load native modules this way because it breaks lazy loading modules. In case you want to load a package of modules eagerly, you can call this method.

```js
import { loadModulesForPackage } from '@open-native/core';

loadModulesForPackage('RNTestModulePackage');
```

You can find the name of the package to load from the native module's source code.
