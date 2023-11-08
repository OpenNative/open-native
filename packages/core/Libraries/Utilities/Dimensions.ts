import { Screen } from '@nativescript/core';
import { getCurrentFontScale } from '@nativescript/core/accessibility';
import { Application } from '@nativescript/core/application';

class Dimensions {
  static get(type: 'window' | 'screen') {
    return {
      width:
        type === 'window'
          ? Application.getRootView()?.getMeasuredWidth?.() || 0
          : Screen.mainScreen.widthDIPs,
      height:
        type === 'window'
          ? Application.getRootView()?.getMeasuredHeight?.() || 0
          : Screen.mainScreen.heightDIPs,
      fontScale: getCurrentFontScale(),
      scale: Screen.mainScreen.scale,
    };
  }
}

export { Dimensions };
