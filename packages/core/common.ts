import { Platform } from './Libraries/Utilities/Platform';
import { requireNativeViewAndroid } from './src/android/viewmanagers';
import { requireNativeViewIOS } from './src/ios/viewmanagers';

export function requireNativeComponent(viewName: string) {
  return Platform.OS === 'ios'
    ? requireNativeViewIOS(viewName as never)
    : requireNativeViewAndroid(viewName as never);
}
