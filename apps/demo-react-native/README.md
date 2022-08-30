# React Native Module Template

A starter for the React Native library written in TypeScript, with linked example project and optional native code written in Swift and Kotlin. This project aims to support the latest React Native versions and keep best practices in mind.

Are you looking for the project template? Check [react-native-better-template](https://github.com/demchenkoalex/react-native-better-template).

## Alternatives

[react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)

[create-react-native-module](https://github.com/brodybits/create-react-native-module)

### Why this template?

First of all, it has TypeScript set up and ready. Also, if you will use a native code, this template uses Swift and Kotlin, which is much better than Objective-C and Java.

The example project is linked in a way so that you can work on your library and see the results of your work immediately. If you use native code you can see linked libraries in the example project opened in Xcode or Android Studio and can modify the code directly from there, just remember to rebuild the example to see the changes. When you change TypeScript code you need to compile it first (using `yarn` command, it has `prepare` hook set up) since with npm you are supplying `lib` folder with JavaScript and type definitions, but there is an [option](#how-to-see-my-changes-immediately-in-the-example) to point example to the `src` folder instead, so that when you modify your library you see changes immediately in the example thanks to [Fast Refresh](https://facebook.github.io/react-native/docs/fast-refresh).

## Usage

Clone this repo, rename the `react-native-module-template` folder to your library name, navigate to that folder and run

```
node rename.js
```

or if you want to **remove native code**

```
node rename.js js-only
```

This will invoke rename script, which removes all references to the template and makes some cleanup.

⚠️⚠️⚠️ This script is not made to be bulletproof, some assumptions are made:

- The script will ask for different information (such as library name, author name, author email etc.) and there might be instructions in the parenthesis, please follow them or something will likely **fail**.
- Use `kebab-case` for the library name, _preferably_ with `react-native` prefix (e.g. `react-native-blue-button`, blue-button, button).
- Use `PascalCase` for the library short name (in case you will have native code, with `js-only` argument script will not ask for this), it is used in native projects (RNModuleTemplate.xcodeproj, RNModuleTemplatePackage.kt etc.). If you prefixed your library name with `react-native` use prefix `RN` for the short name (e.g. `RNBlueButton`, BlueButton, Button).
- Library homepage is used only in `package.json`, if you are not sure, you can press enter to skip this step and modify this field later. Library git url is used only in `.podspec` file, same as above (note that this file will be removed if you pass `js-only` argument).
- Please don't use any special characters in author name since it is a part of Android package name, (e.g. `com.alexdemchenko.reactnativemoduletemplate`) and used in Kotlin and other files. Android package name is generated from author name (with removed spaces and lowercased) and library name (with removed dashes).

Don't forget to remove the rename script, do `yarn` to install dependencies in root and example folders, and, if you kept native code, do `pod install` in `example/ios`.

If you didn't use `js-only` you are good to go. If you did, you need to unlink native code from the example

### iOS

Open Xcode, in the project navigator find `Libraries` folder, reveal contents using the small arrow and hit `DELETE` on `RNModuleTemplate.xcodeproj`. Alternatively, open `example/ios/example.xcodeproj/project.pbxproj`, search for the `Template` (there should be a number of `libRNModuleTemplate.a` and `RNModuleTemplate.xcodeproj` files) and remove all references to them. Please remove whole lines if it among files with other names or whole sections if it is the only item. Groups, like `Library` or `Products`, must stay, just remove the template from appropriate children field.

### Android

In `example/android/settings.gradle` remove

```gradle
include ':react-native-module-template'
project(':react-native-module-template').projectDir = new File(rootProject.projectDir, '../../android')
```

In `example/android/app/build.gradle` remove

```gradle
implementation project(':react-native-module-template')
```

In `example/android/app/src/main/java/com/example/MainApplication.kt` remove

```kotlin
import com.alexdemchenko.reactnativemoduletemplate.RNModuleTemplatePackage

packages.add(RNModuleTemplatePackage())
```

## How example project is linked

The native part is manually linked (you can see changes for Android right above), for iOS check [official docs](https://facebook.github.io/react-native/docs/linking-libraries-ios#manual-linking), but **Header Search Paths** are pointing to the `ios` folder, `$(SRCROOT)/../../ios`, not node_modules.

JavaScript part is using Metro Bundler configuration, see [this article](https://callstack.com/blog/adding-an-example-app-to-your-react-native-library/) for more details and final configuration [here](example/metro.config.js).

In the example's [tsconfig.json](example/tsconfig.json) custom path is specified, so you can import your code the same way end user will do.

```json
"paths": {
  "react-native-module-template": ["../src"]
},
```

### How to see my changes immediately in the example

In the library's `package.json` change

```json
"main": "lib/index.js",
```

to

```json
"main": "src/index.tsx", // or `index.ts` if you don't have JSX there
```

restart the bundler if you have it running

```
yarn start
```

⚠️⚠️⚠️ Don't forget to change this back before making a release, since with npm you supply `lib` folder, not `src`. Let me know if there is a way to do this automatically.

## Release

Create an npm account [here](https://www.npmjs.com/signup) if you don't have one. Then do

```
npm login
```

and

```
npm publish
```

ℹ️ If you want to see what files will be included in your package before release run `npm pack`

ℹ️ If you have native code in your library most of the time you will need `.kt`, `.h`/`.m`, `.swift` files, `project.pbxproj`, `AndroidManifest.xml` and `build.gradle` aside from TypeScript code and default stuff, so keep an eye on what you are publishing, some configuration/build folders or files might sneak in. Most of them (if not all) are ignored in [package.json](package.json).

## FAQ

### VSCode ESLint plugin does not lint example project

By default, ESLint is configured separately for the library's source code and the example. It uses two `.eslintignore` files, the first one for the library, among others it ignores `/example` folder, and the second one for the example project. Since `/example` folder is ignored in one of these files, the plugin does not lint anything in it, see this [issue](https://github.com/microsoft/vscode-eslint/issues/111). To fix that, go to the VSCode settings and set

```json
"eslint.workingDirectories": [
	"./example"
]
```

## License

[MIT](LICENSE)
