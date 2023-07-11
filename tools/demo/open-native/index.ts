import { NativeModules } from '@open-native/core';
import { DemoSharedBase } from '../utils';
import { Platform } from 'react-native';

const RNTestModule = NativeModules.RNTestModule;

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}

export class DemoSharedOpenNative extends DemoSharedBase {
  async testPromise() {
    console.log('testPromise', await RNTestModule.testPromise());
  }

  async testCallback() {
    RNTestModule.testCallback((result) => {
      console.log('testCallback', result);
    });
  }

  async testPrimitives() {
    try {
      if (Platform.OS === 'android') {
        console.log('testSyncMethod', RNTestModule.testSyncMethod());
        console.log('testString', await RNTestModule.testString('string'));
        console.log('testDouble', await RNTestModule.testDouble(10));
        console.log('testJavaDouble', await RNTestModule.testJavaDouble(10));
        console.log('testInt', await RNTestModule.testInt(10));
        console.log('testInteger', await RNTestModule.testInteger(10));
        console.log('testFloat', await RNTestModule.testFloat(10.1));
        console.log('testJavaFloat', await RNTestModule.testJavaFloat(10.1));
        console.log('testBoolean', await RNTestModule.testBoolean(true));
        console.log('testJavaBoolean', await RNTestModule.testJavaBoolean(true));
        console.log('testObject', await RNTestModule.testObject({ boolean: true, number: 1, object: { a: 'b' }, array: 1, float: 3.9, string: 'string' }));
        console.log('testArray', await RNTestModule.testArray([1, true, { a: 'b' }, 1.0, 'string', [0, 1]]));
      } else {
        console.log('testSyncMethod', RNTestModule.testSyncMethod());
        console.log('testString', await RNTestModule.testString('string'));
        console.log('testNumber', await RNTestModule.testNumber(10));
        console.log('testBoolean', await RNTestModule.testBoolean(true));
        console.log('testObject', await RNTestModule.testObject({ boolean: true, number: 1, object: { a: 'b' }, array: 1, float: 3.9, string: 'string' }));
        console.log('testArray', await RNTestModule.testArray([1, true, { a: 'b' }, 1.0, 'string', [0, 1]]));
      }
    } catch (e) {
      console.log(e);
    }
  }
}
