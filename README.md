Open Native brings drop-in support for native modules & libraries originally written for React Native to NativeScript.

## Installation

```
npm install @open-native/core
```

or

```
yarn add @open-native/core
```

## Android Setup

Create `App_Resources/Android/before-plugins.gradle with the following contents

```groovy
allprojects {

  // Nativescript by default runs this hook for all plugin builds,
  // but we want to run it only when the main app builds.
  if (!rootProject.projectDir.absolutePath.contains("tempPlugin")) {
    // We are replacing com.facebook.react:react-native with our local :react library in all linked libraries.
    // We could do this inside the module itself but we want the module to work in both
    // react-native & nativescript
    configurations {
      all {
        resolutionStrategy {
          dependencySubstitution {
            substitute module("com.facebook.react:react-native") using project(":react") because "we will replace this with our local react"
          }
        }
      }
    }
  }
}
```

## Configure Webpack

Alias `react-native` with `@open-native/core`.

```js
webpack.chainWebpack((config) => {
  config.resolve.alias.set('react-native', '@open-native/core');
});
```

If you install a react-natie module & get errors in webpack, install `metro-react-native-babel-preset` via npm/yarn.

```
npm install -D metro-react-native-babel-preset
```

add the following preset to your webpack config.

```js
webpack.chainWebpack((config) => {
  config.resolve.alias.set('react-native', '@open-native/core');
  config.module
    .rule('rnmodules')
    // Add each react-native module that gives errors in webpack build here
    // like this:
    .include.add(/node_modules(.*[/\\])+react-native-module/)
    .end()
    .use('babel-loader')
    .before('ts-loader')
    .loader('babel-loader')
    .options({
      babelrc: false,
      presets: ['module:metro-react-native-babel-preset'],
    });
});
```

That's all, try out some react-native modules & feel free to open and issue if you face a problem.

Join the [NativeScript Discord Community](https://discord.com/invite/RgmpGky9GR)

## Contributing

If you want to contribute, feel free to open an issue or join our discord community to discuss your ideas.

# MIT License

Copyright (c) 2022 Ammar Ahmed
