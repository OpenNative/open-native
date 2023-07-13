---
title: Installing native modules
---

# What are native modules

If you haven't used React Native to build apps before, the term "Native Modules" might seem completely new to you. [Native Modules](https://reactnative.dev/docs/native-modules-intro) are like [NativeScript plugins](https://docs.nativescript.org/plugins/). They allow interacting with some native API or SDK or a Library through a simple and easy to use Javascript interface. For example you might want to access some bluetooth functionality or use a Google service like Firebase/Google Pay in your application.

## Installing native modules

With Open Native setup in your project, installing native modules is very simple. Let's install a simple module as an example so you know how easy it is!

#### react-native-gzip

We are going to install [react-native-gzip](https://github.com/ammarahm-ed/react-native-gzip) which is a native module for fast string compression on android & ios. We will be following it's documentation for installation & Open Native will do the rest for us.

First we will install the module:

# [npm](#/tab/npm)

```
npm install react-native-gzip
```

# [yarn](#/tab/yarn)

```
yarn add react-native-gzip
```

---

And then we are going to use it in our [Svelte Native](https://svelte-native.technology/) app.

```html
<page>
  <actionBar title="Gzip example" />
  <flexboxLayout class="info">
    <button text="Compress string to base64" class="btn" on:tap="{compress}" />
    <label textWrap="true" class="label" text="{compressed}" />

    <button text="Decompress base64 string" class="btn" on:tap="{decompress}" />
    <label class="label" text="{decompressed}" />
  </flexboxLayout>
</page>

<script lang="ts">
  import { deflate, inflate } from 'react-native-gzip';
  let compressed = '';
  let decompressed = '';

  const compress = async () => {
    compressed = await deflate('NativeScript is awesome');
  };

  const decompress = async () => {
    if (compressed) {
      decompressed = await inflate(compressed);
    }
  };
</script>
```

It's that simple. If you go to react-native-gzip documentation, you will find the same steps mentioned there too!

| iOS                                        | Android                                            |
| ------------------------------------------ | -------------------------------------------------- |
| ![Gzip example iOS](/gzip-example-ios.png) | ![Gzip example Android](/gzip-example-android.png) |

See the full gzip example on [github](https://github.com/OpenNative/examples/tree/main/gzip-example).

Okay, that was a really simple module with just two functions. Let's try something more complex.

#### react-native-device-info

We will now install [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info) module in our NativeScript app.

First we will install the module from npm:

# [npm](#/tab/npm)

```
npm install react-native-device-info
```

# [yarn](#/tab/yarn)

```
yarn add react-native-device-info
```

---

And then we can follow the documentation and use DeviceInfo methods in our [NativeScript Vue](https://nativescript-vue.org) app.

```html
<template>
  <Page>
    <ActionBar>
      <label text="DeviceInfo example" />
    </ActionBar>
    <FlexboxLayout class="container">
      <label class="info" :text="name" />

      <label class="info" :text="version" />

      <label class="info" :text="carrier" />
    </FlexboxLayout>
  </Page>
</template>

<script>
  import { getApplicationName, getVersion, getCarrierSync } from 'react-native-device-info';
  export default {
    computed: {
      name() {
        return 'App name:' + getApplicationName();
      },
      version() {
        return 'App version:' + getVersion();
      },
      carrier() {
        return 'Carrier:' + getCarrierSync();
      },
    },
  };
</script>
```

| iOS                                                    | Android                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| ![Deviceinfo example iOS](/deviceinfo-example-ios.png) | ![Deviceinfo example android](/deviceinfo-example-android.png) |

See the full react-native-device-info example on [github](https://github.com/OpenNative/examples/tree/main/deviceinfo-example).

## What's Next

Oh but the native world has never been so straight forward. You might run into some issues when installing different modules. Check out our quick [troubleshooting guide](/troubleshooting) to fix common problems.

### Other resources

- [How to find react native modules](/finding-modules)
