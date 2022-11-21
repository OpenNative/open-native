import { Application } from '@nativescript/core';
import { init } from '@open-native/core';
import notifee from '@notifee/react-native';

if (!global.performance) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  global.performance = {
    now() {
      if (global.android) {
        return java.lang.System.nanoTime() / 1000000;
      } else {
        return CACurrentMediaTime();
      }
    },
  };
}

init();
notifee.onForegroundEvent((data) => {
  console.log('onForegroundEvent');
});

notifee.onBackgroundEvent(async (data) => {
  console.log('onBackgroundEvent');
});

Application.run({ moduleName: 'app-root' });
