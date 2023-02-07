import { DemoSharedBase } from '../utils';
import {  NativeModules } from '@open-native/core';


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
}
