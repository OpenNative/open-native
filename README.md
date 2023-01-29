<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./readme-img/open-native-logo-inverted.svg">
    <img alt="open native logo" width="400" src="./readme-img/open-native-logo.svg">
  </picture>
</p>

We all want to build apps in a way that's approachable to us, regardless of the target platform. Projects like React Native, Flutter, Capacitor, and NativeScript enable us to build native (e.g. iOS and Android) apps using alternative idioms such as JavaScript, Web tech, or platform-agnostic UI.

Each of these projects has a way to map platform APIs into their idiom (e.g. React Native has "native modules"), but none are completely mutually compatible. That is to say, a React Native native module cannot be used in a Flutter app as-is, and vice versa. This situation has led to a great amount of duplicated effort, and an isolation of communities.

Open Native is the long overdue Rosetta Stone that **allows native modules to be used cross-ecosystem**. It handles all the necessary autolinking, type marshalling and API-binding to allow you to choose the highest quality native module for your project, no matter what ecosystem it comes from.

For our first integration, we've **enabled NativeScript to use React Native native modules** the same way one would use them in React Native.

## Getting Started

Head over to the [installation](https://opennative.github.io/open-native/installation) guide to learn how you can integrate Open Native in your NativeScript app.

## Links

- [Documentation](https://opennative.github.io/open-native/)
- [Installation](https://opennative.github.io/open-native/installation)

## I want to contribute

That is great news! There is a lot happening at a very fast pace in this library right now. Every little help is precious. You can contribute in many ways:

- If you have suggestion or idea you want to discuss, [open an issue](https://github.com/OpenNative/open-native/issues).
- Open an issue if you want to make a pull request, and tell me what you want to improve or add so we can discuss about it.

## Contributors

- **Ammar Ahmed**: [Twitter](https://twitter.com/ammarahm_ed), [GitHub](https://github.com/ammarahm-ed)
- **Jamie Birch**: [Twitter](https://twitter.com/LinguaBrowse), [GitHub](https://github.com/shirakaba)
- **[Nathan Walker](https://github.com/NathanWalker/)**
- **[Igor Randjelovic](https://github.com/rigor789)**

## Thanks to

- **[Osei Fortune](https://github.com/triniwiz)**: For his expert help with the NativeScript Android runtime.
- **[Eduardo Speroni](https://github.com/edusperoni/)**: For his expert help with v8 as we take on JSI.
- **[The NativeScript Community](https://discord.com/invite/RgmpGky9GR)**: For being awesome day after day. It's hard to name everyone who helped us and encouraged us to accomplish this.
- **[React Native](https://github.com/facebook/react-native)**: We both have a background in React Native and were able to learn a lot from it. This wouldn't have been possible without React Native and the communities around it.

#
## MIT License
