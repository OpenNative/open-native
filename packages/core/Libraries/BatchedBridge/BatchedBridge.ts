import { Platform } from './../Utilities/Platform';
import {
  getCurrentBridge as getCurrentBridgeAndroid,
  getJSModules as getJSModulesAndroid,
} from '../../src/android/bridge';
import {
  getCurrentBridge as getCurrentBridgeIOS,
  getJSModules as getJSModulesIOS,
} from '../../src/ios/bridge';
import { JSMethodRecord } from '../../src/ios/js-modules';

const getJSModules =
  Platform.OS === 'ios' ? getJSModulesIOS : getJSModulesAndroid;

const BatchedBridge = {
  registerCallableModule: (name: string, callbacks: JSMethodRecord) => {
    Platform.OS === 'ios' ? getCurrentBridgeIOS() : getCurrentBridgeAndroid();
    getJSModules().registerJSModule(name, callbacks);
  },
};

export default BatchedBridge;
