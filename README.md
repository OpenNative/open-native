# Introducing Open Native: Native Modules, for all

We all want to build apps in a way that's approachable to us, regardless of the target platform. Projects like React Native, Flutter, Capacitor, and NativeScript enable us to build native (e.g. iOS and Android) apps using alternative idioms such as JavaScript, Web tech, or platform-agnostic UI.

Each of these projects has a way to map platform APIs into their idiom (e.g. React Native has "native modules"), but none are completely mutually compatible. That is to say, a React Native native module cannot be used in a Flutter app as-is, and vice versa. This situation has led to a great amount of duplicated effort, and an isolation of communities.

**Open Native** to the rescue.

<p align="center">
  <img src="open-native-logo.png" width="270">
</p>

## What is Open Native?

Open Native is the long overdue Rosetta Stone that **allows native modules to be used cross-ecosystem**. It handles all the necessary autolinking, type marshalling and API-binding to allow you to choose the highest quality native module for your project, no matter what ecosystem it comes from.

For our first integration, we've **enabled NativeScript to use React Native native modules**. Any NativeScript app, new or existing, can start using React Native native modules simply by running `npm install @open-native/core` and adding a few lines to their Webpack config[^webpack]. From there, just `npm install` the native module (autolinking is handled under-the-hood). The module can then be used **almost exactly as documented for React Native**.

## How feature-complete is it?

Rather than a ground-up rewrite, we actually implemented the React Native native module APIs and autolinking process using **the very same code** from the React Native and React Native Community CLI codebases. This ensures excellent consistency and also gives us broad feature coverage. So it comes down to which slices we've taken so far.

At the time of writing, we **fully support bridge-based non-UI modules**. TurboModules are supported, but not ones making use of JSI, as we haven't looked into that yet.

UI module support, although exciting in concept, may be out of scope. As React Native UI modules are distributed as React components, they could only practically be consumed by React-based apps, which would greatly diminish the value of the effort to implement it. At best, we could **decouple the underlying native UI element from React** and expose it for non-React wrappers to be (manually) built around them. Layout could also be delegated to a view component from the consuming ecosystem - e.g. [taffy](https://github.com/DioxusLabs/taffy) could be used, rather than [yoga](https://yogalayout.com).

## How is the performance?

Performance of native modules running with Open Native mainly depend on the host runtime's performance. The implementation of native module API uses exactly the same code as the original implementation, however we have made some optimisations with careful consideration for even better performance.

In our first integration with NativeScript, bridge based native modules perform almost **7-8 times faster** compared to React Native on iOS. The difference is large due to the fact that NativeScript is able to call native APIs directly by default without a bridge unlike React Native.

We've also treated all bridge based native modules as TurboModules, lazy-loading them until the first API call, so **startup time should not be affected for NativeScript apps**.

As for size, we've taken **just the core code we need**, which is only a small subset of React Native code that is sufficient to run native modules.

## Is it production-ready?

Open Native is already in use in production apps, so it had better be!

For example, running the auth0 module in a NativeScript app is as simple as:

```js
npm install react-native-auth0
```

And then you can use the module same as you would in a React Native app:

```js
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: 'domain', clientId: 'client_id' });

auth0.webAuth
  .authorize({ scope: 'openid profile email' })
  .then((credentials) => console.log(credentials))
  .catch((error) => console.log(error));
```

We are still testing out different native modules and filling in any gaps left. We'll have more news on that in a follow-up blog post.

## What's next?

Allowing React Native native modules to be used in additional ecosystems would be a relatively small task from here, as we've done most of the groundwork (implementing autolinking and the bridge module API in an ecosystem-agnostic manner) already. Other ecosystems would mainly just need to contribute adapters for the final step, namely invoking APIs on the native modules from a non-native context.

Additional integrations can also be tackled in time, e.g. allowing Flutter platform channels, Capacitor plugins, and NativeScript plugins to be used in other ecosystems. Please do get in touch if you think you could be of help, as there's only so much we can tackle on our own!

For now, we're happy just to have pushed the first domino in allowing communities to work together on solving the same problems.

To keep updated on future developments and the blog posts to come, you can follow the [Open Native](https://github.com/OpenNative/open-native) repo (a star would be nice, too!) and, humbly, ourselves:

- **Ammar Ahmed**: [Twitter](https://twitter.com/ammarahm_ed), [GitHub](https://github.com/ammarahm-ed)
- **Jamie Birch**: [Twitter](https://twitter.com/LinguaBrowse), [GitHub](https://github.com/shirakaba)

[^webpack]: See [packages/core/README.md](packages/core/README.md) for instructions.
