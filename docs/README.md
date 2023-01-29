<div>
    <img alt="open native logo" width="100%" src="open-native-logo.svg">
</div>

We all want to build apps in a way that's approachable to us, regardless of the target platform. Projects like React Native, Flutter, Capacitor, and NativeScript enable us to build native (e.g. iOS and Android) apps using alternative idioms such as JavaScript, Web tech, or platform-agnostic UI.

Each of these projects has a way to map platform APIs into their idiom (e.g. React Native has "native modules"), but none are completely mutually compatible. That is to say, a React Native native module cannot be used in a Flutter app as-is, and vice versa. This situation has led to a great amount of duplicated effort, and an isolation of communities.

Open Native is the long overdue Rosetta Stone that **allows native modules to be used cross-ecosystem**. It handles all the necessary autolinking, type marshalling and API-binding to allow you to choose the highest quality native module for your project, no matter what ecosystem it comes from.

For our first integration, we've **enabled NativeScript to use React Native native modules** the same way one would use them in React Native.

## Getting Started

Head over to the [installation](/installation) guide to learn how you can integrate Open Native in your NativeScript app.




