import { RNJavaSerialisableType } from '../src/common';

export const CoreModuleMap = {
  LinkingManager: {
    e: false,
    m: {
      canOpenURL: {
        j: 'canOpenURL',
        t: [
          RNJavaSerialisableType.nonnullString,
          RNJavaSerialisableType.Promise,
        ],
      },
      getInitialURL: {
        j: 'getInitialURL',
        t: [RNJavaSerialisableType.Promise],
      },
      openSettings: {
        j: 'openSettings',
        t: [RNJavaSerialisableType.Promise],
      },
      openURL: {
        j: 'openURL',
        t: [
          RNJavaSerialisableType.nonnullString,
          RNJavaSerialisableType.Promise,
        ],
      },
      sendIntentExtras: {
        j: 'sendIntentExtras',
        t: [
          RNJavaSerialisableType.nonnullString,
          RNJavaSerialisableType.nonnullArray,
          RNJavaSerialisableType.Promise,
        ],
      },
    },
  },
};
