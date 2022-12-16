import { Screen } from '@nativescript/core';
import { getCurrentFontScale } from '@nativescript/core/accessibility';
import { getRootView } from '@nativescript/core/application';

class Dimensions {
  static get(type: 'window' | 'screen') {
    getRootView().width;
    return {
      width:
        type === 'window'
          ? getRootView().getMeasuredWidth?.() || 0
          : Screen.mainScreen.widthDIPs,
      height:
        type === 'window'
          ? getRootView().getMeasuredHeight?.() || 0
          : Screen.mainScreen.heightDIPs,
      fontScale: getCurrentFontScale(),
      scale: Screen.mainScreen.scale,
    };
  }
}

export { Dimensions };
