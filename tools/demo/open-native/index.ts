import { Utils } from '@nativescript/core';
import { DemoSharedBase } from '../utils';
import { NativeModules } from '@open-native/core';

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}

export class DemoSharedOpenNative extends DemoSharedBase {
  async testPromise() {
    // console.log('launching image picker');
    // const images = [];
    // const singleSelectedMode = true;
    // openPicker({
    //   selectedAssets: images,
    //   isExportThumbnail: true,
    //   maxVideo: 1,
    //   doneTitle: 'DONE',
    //   singleSelectedMode,
    //   isCrop: true,
    // })
    //   .then(console.log)
    //   .catch(console.log);
  }

  async testPrimitives() {
    // try {
    //   console.log(await NativeModules.RNTestModule.testDouble(10));
    //   console.log(await NativeModules.RNTestModule.testJavaDouble(10));
    //   console.log(await NativeModules.RNTestModule.testInt(10));
    //   console.log(await NativeModules.RNTestModule.testInteger(10));
    //   console.log(await NativeModules.RNTestModule.testFloat(10.1));
    //   console.log(await NativeModules.RNTestModule.testJavaFloat(10.1));
    //   console.log(await NativeModules.RNTestModule.testBoolean(true));
    //   console.log(await NativeModules.RNTestModule.testJavaBoolean(true));
    // } catch (e) {
    //   console.log(e);
    // }
  }
}
