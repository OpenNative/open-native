import { RNObjcSerialisableType } from '../common';

export const CoreModuleMap = {
  LinkingManager: {
    e: false,
    m: {
      canOpenURL: {
        j: 'canOpenURLResolveReject',
        t: [
          RNObjcSerialisableType.string,
          RNObjcSerialisableType.RCTPromiseResolveBlock,
          RNObjcSerialisableType.RCTPromiseRejectBlock,
        ],
      },
      getInitialURL: {
        j: 'getInitialURLReject',
        t: [
          RNObjcSerialisableType.RCTPromiseResolveBlock,
          RNObjcSerialisableType.RCTPromiseRejectBlock,
        ],
      },
      openSettings: {
        j: 'openSettingsReject',
        t: [
          RNObjcSerialisableType.RCTPromiseResolveBlock,
          RNObjcSerialisableType.RCTPromiseRejectBlock,
        ],
      },
      openURL: {
        j: 'openURLResolveReject',
        t: [
          RNObjcSerialisableType.string,
          RNObjcSerialisableType.RCTPromiseResolveBlock,
          RNObjcSerialisableType.RCTPromiseRejectBlock,
        ],
      },
      sendIntentExtras: {
        j: 'sendIntentExtrasResolveReject',
        t: [
          RNObjcSerialisableType.string,
          RNObjcSerialisableType.array,
          RNObjcSerialisableType.RCTPromiseResolveBlock,
          RNObjcSerialisableType.RCTPromiseResolveBlock,
        ],
      },
    },
  },
};
