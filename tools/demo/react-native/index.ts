import { DemoSharedBase } from '../utils';
import { NativeModules } from '@ammarahm-ed/react-native';
import Auth0 from 'react-native-auth0';

export class DemoSharedReactNative extends DemoSharedBase {
  loadBridge() {
    console.log(Auth0);
  }
}
