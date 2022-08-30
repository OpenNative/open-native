# @ammarahm-ed/react-native

Today almost every other SDK, Api or software is trying to add first class support for React Native. There are more than 50K react native modules in github and you can almost find a module for your use case. Many such modules are maintained and backed by well known companies and used by thousands of devs and therefore are more stable and reliable solution for a specific use case.

NativeScript is great in that it gives you direct access to platform APIs however there are certain problems that require an abstraction for common day-to-day devs to just install and use instead of learning how the platform works and going through the specific documentation and implementing things from scratch. Therefore NativeScript has it's own plugins too but many are not well maintained anymore and are getting outdated eventually. The core team of NativeScript tries to add support for very popular plugins themselves but I really think this is something they should never have to do so they could work only on the core parts of NativeScript while the rest is managed by the community and devs using the plugins. But it's too late.

React Native & Flutter have won this race. However soon this is going to change because of how NativeScript has been designed from scratch, we are adding first class support for react native modules & even flutter dart packages in future to {N}.

## Architecture on android

Our goal is allow user's of this plugin to be able to install **any** react native module with a single command:

```fish
yarn add react-native-module
```

To make this possible, we have to ensure that we do not interfere with how React Native modules work at the surface level in Java/Obj-C code.

At first, let's look at how react native modules work:

![Bridge Diagram](https://raw.githubusercontent.com/ammarahm-ed/nativescript-magic-spells/main/packages/react-native/assets/bridge.svg)

At a basic level, native modules in React Native are installed from node_modules folder. React Native supports auto linking which automatically links the modules to the bridge however I will explain briefly how manual linking works which is the basis of auto-linking.

1.

```javascript
ns plugin add @ammarahm-ed/react-native
```

## Usage

// TODO

## MIT License
