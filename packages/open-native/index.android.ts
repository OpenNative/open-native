import RCTDeviceEventEmitter from './core/EventEmitter/RCTDeviceEventEmitter';
export { default as NativeEventEmitter } from './core/EventEmitter/NativeEventEmitter';
export { Platform } from './core/Utilities/Platform';
export { NativeModules } from './src/android/nativemodules';
export { Linking } from './core/Libraries/Linking/Linking';
export const DeviceEventEmitter = RCTDeviceEventEmitter;
