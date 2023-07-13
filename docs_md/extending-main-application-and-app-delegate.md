# Extending MainApplication & AppDelegate

There are some React Native modules that will require you to extend `MainApplication` on android or extend `AppDelegate` on iOS.

## Extending MainApplication on Android

This is usually required by native modules that want to do some background work when app is in killed state. For example a native module that wakes up the app when user taps on a Notification.

Create a `application.android.ts` at the root of your project:

```js
/* eslint-disable @typescript-eslint/no-unused-vars */
@NativeClass()
@JavaProxy('com.tns.NativeScriptApplication')
class Application extends com.facebook.react.ReactCustomApplication {
  public onCreate(): void {
    super.onCreate();
  }

  public attachBaseContext(baseContext: android.content.Context) {
    super.attachBaseContext(baseContext);
  }
}
```

Open your project's `webpack.config.js` file and add the custom NativeScriptApplication entry.

```js
webpack.chainWebpack((config) => {
  config.entry('application').add('./application.android');
});
```

## Extending AppDelegate on iOS

As an example `react-native-background-fetch` module requires that we call `TSBackgroundFetch.sharedInstance().didFinishLaunching()` when our app launches in AppDelegate. Here's how we can achieve this in NativeScript.

# [app.ts](#/tab/typescript)

```js
import { Application } from '@nativescript/core';

if (global.isIOS) {
  @NativeClass()
  @ObjCClass(UIApplicationDelegate)
  class MyDelegate extends UIResponder implements UIApplicationDelegate {
    applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary<string, any>): boolean {
      //@ts-ignore
      TSBackgroundFetch.sharedInstance.didFinishLaunching();
      return true;
    }
  }
  Application.ios.delegate = MyDelegate;
}
```

# [app.js](#/tab/javascript)

```js
import { Application } from '@nativescript/core';

if (global.isIOS) {
  const MyDelegate = UIResponder.extend(
    {
      applicationDidFinishLaunchingWithOptions(application, launchOptions) {
        TSBackgroundFetch.sharedInstance.didFinishLaunching();
        return true;
      },
    },
    {
      name: 'MyDelegate',
      protocols: [UIApplicationDelegate],
    }
  );

  Application.ios.delegate = MyDelegate;
}
```

---
