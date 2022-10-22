import { isAndroid } from '@nativescript/core';
//@ts-ignore
import Auth0 from 'react-native-auth0';

import { DemoSharedBase } from '../utils';

const auth0 = new Auth0({ domain: 'https://dev-mr5werjm.us.auth0.com', clientId: 'xbUxJUQ5ofi7qoRHn3YjZp6A1f7qdZ5n' });

export class DemoSharedReactNative extends DemoSharedBase {
  loadBridge() {
    if (isAndroid) {
      // On first build, all these are undefined for some reason.
      // It seems that the metadata generator skips these first time but
      // picks them when app is built the second time. It's probably because
      // the metadata generator runs earlier than it should????
      //@ts-ignore
      console.log(com.facebook, com.auth0, com.testmodule, com.bridge);
      return;
    }

    auth0.webAuth
      .authorize({ scope: 'openid profile email' })
      .then((credentials) => console.log(credentials))
      .catch((error) => console.log(error));
    // NativeModules.A0Auth0.showUrl('dev-mr5werjm.us.auth0.com', true, false, (e, r) => {
    //   console.log(e, r);
    // });
    // const RCTLink = new RCTLinkingManager();
    // for (let key in RCTLink) {
    //   console.log(key);
    // }
    //console.log(global.reactNativeBridgeIOS?.moduleForName("RNTestModule"));
    //console.log(NativeModules.LinkingManager?.openURL("https://google.com"));
  }

  getName() {
    // console.log(Object.keys(NativeModules));
  }
  callbackTest() {
    console.log('to do');
  }
}
