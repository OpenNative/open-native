import { Platform } from 'react-native';
import { requireNativeViewIOS, requireNativeViewAndroid } from '@open-native/core';

export const WebView = Platform.OS === 'ios' ? requireNativeViewIOS('RNCWebView') : requireNativeViewAndroid('RNCWebView' as never);
