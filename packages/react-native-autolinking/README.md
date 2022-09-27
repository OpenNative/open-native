# @ammarahm-ed/react-native-autolinking

A library of autolinking utilities to be called by other packages (usually upon a NativeScript lifecycle hook).

```sh
npm install --save @ammarahm-ed/react-native-autolinking
```

## Usage

```ts
import { autolinkIos } from '@ammarahm-ed/react-native-autolinking';

// This is how you'd call it, though see '@ammarahm-ed/react-native-podspecs'
// for how to use it in the context of a hook.
await autolinkIos({
  dependencies: ['@ammarahm-ed/react-native-module-test'],
  projectDir: '/Users/jamie/Documents/git/nativescript-magic-spells/apps/demo',
});
```

## License

Apache License Version 2.0
