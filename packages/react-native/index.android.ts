import RCTDeviceEventEmitter from './core/EventEmitter/RCTDeviceEventEmitter';
export { default as NativeEventEmitter } from './core/EventEmitter/NativeEventEmitter';

export const NativeModules = {};
export const DeviceEventEmitter = RCTDeviceEventEmitter;

// FIXME: uncomment and resolve compilation errors
// export class ReactNative {
//   bridge: com.bridge.Bridge;
//   reactContext: com.facebook.react.bridge.ReactApplicationContext;
//   init() {
//     if (!com.facebook) {
//       console.log('com.facebook does not exist');
//       return;
//     }
//     this.reactContext = new com.facebook.react.bridge.ReactApplicationContext(Utils.android.getApplicationContext());
//     this.bridge = new com.bridge.Bridge(this.reactContext);
//   }

//   getName() {
//     if (!this.bridge) return;
//     const RNTestModule = this.bridge.getModuleByName('RNTestModule');
//     return RNTestModule.getName();
//   }

//   callbackTest() {
//     if (!this.bridge) return;
//     const RNTestModule = this.bridge.getModuleByName('RNTestModule') as unknown as com.testmodule.RNTestModule;
//     RNTestModule.testCallback(
//       new com.facebook.react.bridge.Callback({
//         invoke: (data) => {
//           console.log(data[0]);
//         },
//       })
//     );
//   }
// }
