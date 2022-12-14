import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.plugindemo',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  appPath: 'src',
  cli: {
    packageManager: 'npm',
  },
  hooks: [
    {
      type: 'before-prepare',
      script: './scripts/before-prepare.js',
    },
    {
      type: 'before-prepareNativeApp',
      script: './scripts/before-prepareNativeApp.js',
    },
  ],
} as NativeScriptConfig;
