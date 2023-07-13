---
title: Troubleshooting
---

# Troubleshooting

While most of native modules will just work directly, you might run into some issues with some. Here's a list of some common problems & their easy fixes.

### 1. The number of references in a .dex file cannot exceed 64K.

![multidex error](/multidex-error.png)

The simple fix for this is to enable multidex in your android app.

1. Open `App_Resources/Android/app.gradle`
2. Add `multiDexEnabled true` inside `defaultConfig

```groovy
defaultConfig {
    ...
    multiDexEnabled true
  }
```

See [gzip-example app.gradle](https://github.com/OpenNative/examples/blob/0857f426385702678dec690d858d3e8671b48718/device-info-example/App_Resources/Android/app.gradle#L20)

### 2. Webpack compilation errors after installing a react native module

This usually happens when a module mixes ESM and CommonJS in a single file. To fix this we need to compile the module with `metro-react-native-babel-preset`. First install `metro-react-native-babel-preset`.

# [npm](#/tab/npm)

```
npm install -D metro-react-native-babel-preset
```

# [yarn](#/tab/yarn)

```
yarn add -D metro-react-native-babel-preset
```

---

Now open `webpack.config.js` file & add the following for your module.

```js
module.exports = (env) => {
  ...
webpack.chainWebpack((config) => {
    config.module
      .rule('rnmodules')
      // Replace the `react-native-module` part with the module you installed.
      .include.add(/node_modules(.*[/\\])+react-native-module/)
      // Or for modules such as @react-native-community/module-name use the following regex.
      .include.add(/node_modules(.*[/\\])+@module-org\/module-name/,)
      .end()
      .use('babel-loader')
      .before('ts-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['module:metro-react-native-babel-preset'],
      });
  });
  ...
  return webpack.resolveConfig();
};
```

### 3. Native Modules stopped working after updating Open Native.

This usually happens because your `hooks` folder is outdated. The easiest way to fix this is run `ns clean` and run your project again so open native hooks are updated.

### 4. X Native Module is not working
While Open Native can run most native modules, there might be some exceptions that require a few extra steps. Feel free to open an [issue](https://github.com/OpenNative/open-native/issues) and we will take a look. You can also join [NativeScript Discord Community](https://discord.com/invite/RgmpGky9GR) and send a message in #open-native channel for quicker help.
