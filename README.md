- [@ammarahm-ed/react-native](packages/react-native/README.md)
- [@ammarahm-ed/react-native-module-test](packages/react-native-module-test/README.md)

# How to use?

This workspace manages the suite of plugins listed above.

In general, when in doubt with what to do, just `npm start`.

# @ammarahm-ed/nativescript-magic-spells

Nativescript magic spells is an effort to build a series of plugins that will revolutionize the way you develop apps with NativeScript.

## Motivation

NativeScript is a great framework to build apps but since React Native & Flutter came out they have completely taken over the market and the community of developers. Thus over the years, NativeScript community has grown smaller which has lead to a slowdown in development. This slowdown has occured due to the fact that the core team has a lot of work to do, which includes keeping the framework updated, update docs, write blogs, manage the community and lastly, to maintain a long list of plugins themselves.

My goal is to help the core NativeScript team focus on the core parts of the framework while, we the community around NativeScript work on the rest of things and find ways to give NativeScript the boost it needs to become mainstream again.

## Why NativeScript

One of the main reasons why NativeScript is still being maintained by such a small team of developers is because of how great it has been built from ground up. It's a revolutionary piece of software that let's you truly have 100% access of platform APIs directly in Javascript. For example, here's how I can create a Java Object in NativeScript.

```ts
const javaObj = new java.lang.Object();
```

And NativeScript will handle the rest of the headache, I don't have to switch IDEs to write a Native plugins or access platform APIs, I can write Java in Javascript.

See more about this here:

- [High Fidelity Platform APIs with v8 and NativeScript](https://www.youtube.com/watch?v=Mzy1jWxrSiw)

- [Native API Access ](https://docs.nativescript.org/native-api-access.html)

NativeScript was developed to be flexible and adabtable to any kind of use case and requirement. This is why it supports many frameworks such as React, Vue, Svelte, Angular & even has experimental SolidJS support.

NativeScript is not backed by some big tech company that can one day just decide it does not want to develop this anymore. It's supported by OpenJS Foundation and is truly a community effort from ground up. This also means that we the community are in control of it.

Finally this is open source, if you really want something excel, you have step in and play your part and help out. It's a community based effort and that's what I want to do, to leave you absolutely no excuse to not choose NativeScript.

Join the [NativeScript Discord Community](https://discord.com/invite/RgmpGky9GR)

## First spell: react native modules support

In the first spell, I and [@shirakaba](https://github.com/shirakaba) will be adding full support for **all** react-native native modules by writing a very thin layer of react-native that will expose the react native modules to NativeScript. The basic POC is ready on android with a functional RN module that works in {N} without any modifications.

- Go to [@ammarahm-ed/react-native](packages/react-native/README.md) to learn more.
- Read the [roadmap](https://github.com/ammarahm-ed/nativescript-magic-spells/issues/2)

## Contributing

If you want to contribute, feel free to open an issue or join our discord community to discuss your ideas.

##

> _Nothing is impossible if you put your mind to it_

# MIT License

Copyright (c) 2022 Ammar Ahmed
