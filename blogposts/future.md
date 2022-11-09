# A new, open future for native modules with Open Native

[Open Native](https://github.com/OpenNative/open-native) is the long overdue Rosetta Stone that **allows native modules to be used cross-ecosystem**. It handles all the necessary autolinking, type marshalling and API-binding to allow you to choose the highest quality native module for your project, no matter what ecosystem it comes from.

In our last blog post, we focused on what's possible today: Open Native enables you to **use React Native native modules in NativeScript apps, exactly as documented for React Native**.

For this blog post, we'll discuss what this paves way for in the future: **native modules from React Native, Flutter, Capacitor, NativeScript, and all sorts of other ecosystems, could one day be used interchangeably** regardless of which framework you use to build your app.

## What's wrong with native modules today?

Native modules are a way to expose native (e.g. iOS or Android) functionality for use with an alternative framework (e.g. React Native). It may involve crossing languages (e.g. Objective-C to JavaScript), and/or crossing idioms (e.g. imperative UI to declarative UI, or logic-on-one-thread to logic-across-two-threads).

As there is a great variety in idioms, and difficulty in mapping between radically different ones (e.g. Flutter uses its own ground-up UI components while other frameworks make use of native views), it is **challenging to come up with a universal approach to architecting native modules** that is both simple and compromise-free.

As no universal approach has come into adoption, React Native native modules have been restricted to use with React Native, Flutter ones with Flutter, and so on. This has led each ecosystem into **duplicating work over and over again**. We have independent geolocation modules for [React Native](https://github.com/michalchudziak/react-native-geolocation), [Flutter](https://github.com/Baseflow/flutter-geolocator), [Capacitor](https://github.com/ionic-team/capacitor-plugins#readme), [NativeScript](https://github.com/NativeScript/nativescript-geolocation/issues), and so on, which all likely call largely the same underlying native APIs to achieve the same thing.

## Why has no universal standard emerged?

A universal native module format *has* actually been proposed before - Expo Unimodules [were discussed](https://twitter.com/emiltabakov/status/1156559183883526146) as **a common native module interface for all cross-platform frameworks**. Each ecosystem could write an adapter to support the Unimodules API (see Expo's official one for [React Native](https://github.com/expo/expo/tree/a2aad4ea6e9f327d03a9852102e18387420f3254/packages/%40unimodules/react-native-adapter), the proof-of-concept for [Flutter](https://github.com/expo/expo/tree/a2aad4ea6e9f327d03a9852102e18387420f3254/packages/expo-flutter-adapter), and even my own proof-of-concept for [NativeScript](https://github.com/nativescript-community/expo-nativescript/tree/main/packages/expo-nativescript-adapter)) and be able to directly consume Unimodules. However, lack of adoption sadly led to its deprecation in favour of [Expo Modules in SDK 43](https://blog.expo.dev/whats-new-in-expo-modules-infrastructure-7a7cdda81ebc). On the bright side, closer integration with React Native enabled [significant improvements](https://docs.expo.dev/modules/module-api/) in developer experience, for example first-class support for Swift and Kotlin as well as JSI. So it is important to consider that too much decoupling can restrict innovation, and a universal module format may never be quite as capable as a single-ecosystem one.

The idea of a universal module format nonetheless has merit, even if it may have to cut some corners on certain capabilities - JSI, for example, may be a feature too unique to React Native to consider standardising into a universal module format, which should focus on common functionality first. Considering just basic use-cases, however, the low rate of adoption for a universal native module format is probably simply because **developers usually intend to use a native module purely within one ecosystem**, so have little reason to go to the (potentially) extra effort of setting up the native module as a universal one. So how can we encourage adoption of a universal module format without placing extra burden on developers?

What makes Open Native novel is that it handles all the burden of mapping modules from one ecosystem to another. **Developers can simply write for one ecosystem, and allow Open Native to translate their native module for other ecosystems**. So there could well be a universal module format, but it could simply be an internal implementation detail of Open Native.

## How could native modules be made more friendly for cross-ecosystem consumption?

Although leaving all the hard work to Open Native is one thing, **cross-platform frameworks could meet Open Native halfway** simply by making their native modules easier to parse and less dependent on ecosystem-specific tooling like a dedicated CLI.

In implementing Open Native, we faced many challenges in parsing React Native native modules. For example, iOS native modules rely on C macro expansion in implementation files, and thus do not expose their APIs in headers. We therefore have some ideas about how **each ecosystem could make their native module implementations more statically analysable** to external tooling.

A framework that could describe its native module APIs entirely in a static format like JSON would be **far easier to adapt**, for example! This is actually how we express the shape of native modules internally. For example, Open Native parses native modules like [RCTLinkingManager.mm](https://github.com/facebook/react-native/blob/5744b219c75ab6c2963d962d07edd6bf2f733662/Libraries/LinkingIOS/RCTLinkingManager.mm#L95-L120) and outputs the following metadata (pretty-printed):

```js
{
  // The module's "exported" name, i.e. the
  // way it is called when accessed from
  // React Native's `NativeModules` store.
  "LinkingManager": {
  
    // The name by which that module is
    // exposed to NativeScript on the JS
    // side (simply the same as the Obj-C
    // class).
    "jsName": "RCTLinkingManager",
    
    // Whether it has any constants to
    // export. This informs our
    // lazy-loading support.
    "exportsConstants": false,
    
    // All the methods the module exports.
    "methods": {
    
      // The exported name of the method.
      "openURL": {
      
        // The name by which that method
        // is exposed to NativeScript on
        // the JS side (camel-casing
        // instead of colons).
        "jsName": "openURLResolveReject",
        
        // The types, starting with the
        // return type.
        "types": [
          "void",
          "string",
          "RCTPromiseResolveBlock",
          "RCTPromiseRejectBlock"
        ]
      },
      
      // (other methods omitted)
    }
  }
}
```

It also handles the whole autolinking process, figuring out which modules should be installed. e.g. for [react-native-auth0](https://github.com/auth0/react-native-auth0), it produces this entry to be added to one's Podfile:

```ruby
pod 'A0Auth0', path: "/example_app/node_modules/react-native-auth0/A0Auth0.podspec"
```

There's a lot more to be said on this topic (Android has it's own challenges, and codegen is yet another obstacle), but that's the basic idea. Even if it would be just *on top* of the existing native module API (i.e. write native modules as one normally would, but additionally provide some "summary files" like the two above), it would really reduce the complexity of supporting native modules across ecosystems.

But that's just one thought of many. The key hope with Open Native is to get communities talking about whether there's more we could do to improve collaboration across ecosystems, reduce duplicated work and allow us to all benefit from the best possible native modules. Please do share your thoughts and add to the conversation!

– Jamie Birch

---

To keep updated on future developments and the blog posts to come, you can follow this repo (a star would be nice, too!) and, humbly, ourselves:

- **Ammar Ahmed**: [Twitter](https://twitter.com/ammarahm_ed), [GitHub](https://github.com/ammarahm-ed)
- **Jamie Birch**: [Twitter](https://twitter.com/LinguaBrowse), [GitHub](https://github.com/shirakaba)
