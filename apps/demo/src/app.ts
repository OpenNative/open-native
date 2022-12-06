import { Application } from '@nativescript/core';
import { init } from '@open-native/core';

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

Application.run({ moduleName: 'app-root' });
