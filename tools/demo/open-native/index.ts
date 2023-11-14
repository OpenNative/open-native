import { NativeModules } from '@open-native/core';
import { DemoSharedBase } from '../utils';
import { Platform } from 'react-native';

const RNTestModule = NativeModules.RNTestModule;

export class DemoSharedOpenNative extends DemoSharedBase {
  async testPromise() {
    console.log('testPromise', await RNTestModule.testPromise());

    RNTestModule.testPromiseReject().catch(e => {
      console.log("testPromiseReject", e);
    });
    RNTestModule.testPromiseReject3().catch(e => {
      console.log("testPromiseReject2", e);
    });
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
        console.log('testInteger', await RNTestModule.testInteger(900));
        console.log('testCGFloat', await RNTestModule.testCGFloat(1.4));
        console.log('testInt', await RNTestModule.testInt(10));
        console.log('testFloat', await RNTestModule.testFloat(3.4));
        console.log('testDouble', await RNTestModule.testDouble(2.4));
        console.log('testBoolean', await RNTestModule.testBoolean(true));


        console.log('testObject', await RNTestModule.testObject({ boolean: true, number: 1, object: { a: 'b' }, array: 1, float: 3.9, string: 'string' }));
        console.log('testArray', await RNTestModule.testArray([1, true, { a: 'b' }, 1.0, 'string', [0, 1]]));
      }
    } catch (e) {
      console.log(e);
    }
  }
}
