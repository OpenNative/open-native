import { DemoSharedBase } from '../utils';
import { NativeModules } from '@open-native/core';

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  await action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}

export class DemoSharedOpenNative extends DemoSharedBase {
  testPromise() {
    const testPromise = async () => {
      for (let i = 0; i < 5000; i++) {
        await NativeModules.RNTestModule.testPromise();
      }
    };
    measure('promise', testPromise);
  }

  async testPrimitives() {
    try {
      console.log(await NativeModules.RNTestModule.testDouble(10));
      console.log(await NativeModules.RNTestModule.testJavaDouble(10));

      console.log(await NativeModules.RNTestModule.testInt(10));
      console.log(await NativeModules.RNTestModule.testInteger(10));

      console.log(await NativeModules.RNTestModule.testFloat(10.1));
      console.log(await NativeModules.RNTestModule.testJavaFloat(10.1));

      console.log(await NativeModules.RNTestModule.testBoolean(true));
      console.log(await NativeModules.RNTestModule.testJavaBoolean(true));
    } catch (e) {
      console.log(e);
    }
  }
}
