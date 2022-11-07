## Benchmarking performance of Native Modules

Benchmarks on ReactNative & NativeScript use the same function to measure performance.

```js
async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  await action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}
```

For now we have only run benchmarks for awating Promises on Native Modules on iOS. We use the following function on both NativeScript & ReactNative.

```js
const testPromise = async () => {
  for (let i = 0; i < 5000; i++) {
    await NativeModules.RNTestModuleAliased.testPromise();
  }
};
measure('promise', testPromise);
```

## Running benchmarks

To run the benchmarks in NativeScript first setup your environment for [NativeScript](https://docs.nativescript.org/environment-setup#setting-up-your-system) & [React Native](https://reactnative.dev/docs/environment-setup)

Clone the repo

```
git clone https://github.com/OpenNative/open-native
```

Run basic setup commands for the monorepo

```
yarn setup
```

### NativeScript

Install the hooks

```
yarn demo:hooks
```

Navigate to the demo app.

```
cd apps/demo
```

Run the app

```
ns run ios
```

### ReactNative

Navigate to the demo-react-native app.

```
cd apps/demo-react-native
```

Install pods

```
pod install
```

Run the app from monorepo root.

```
yarn start:rni
```
