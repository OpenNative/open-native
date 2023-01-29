Open Native is an effort to bring cross platform communities together & help them collaborate and share work.

## Installation

```
npm install @open-native/core
```

## Android Setup

Create `App_Resources/Android/before-plugins.gradle with the following contents

```groovy
apply from: new File(["node", "--print", "require.resolve('@open-native/core/package.json')"].execute(null, rootDir).text.trim(), "../scripts/open-native.gradle");
```

Create `App_Resources/Android/settings.gradle` and paste the following contents:

```groovy
apply from: new File(["node", "--print", "require.resolve('@open-native/core/package.json')"].execute(null, rootDir).text.trim(), "../scripts/native_modules.gradle");
```

## Configure Webpack (Optional)
If you install a react-native module & get errors during webpack complation, install `metro-react-native-babel-preset` via npm/yarn.

```
npm install -D metro-react-native-babel-preset
```

add the following preset to your webpack config.

```js
webpack.chainWebpack((config) => {
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
