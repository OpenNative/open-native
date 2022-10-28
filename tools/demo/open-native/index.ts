// import { isAndroid } from '@nativescript/core';
//@ts-ignore
import Auth0 from 'react-native-auth0';
import { DemoSharedBase } from '../utils';
import { NativeModules } from 'open-native';
const auth0 = new Auth0({ domain: 'https://dev-mr5werjm.us.auth0.com', clientId: 'xbUxJUQ5ofi7qoRHn3YjZp6A1f7qdZ5n' });

export class DemoSharedOpenNative extends DemoSharedBase {
  loadBridge() {
    //console.log(NativeModules.RNTestModule);
    // console.time('promise-test');
    // NativeModules.RNTestModuleAliased.show()
    //   .then(() => {
    //     console.timeEnd('promise-test');
    //   })
    //   .catch((e) => console.log(e));

    auth0.webAuth
      .authorize({ scope: 'openid profile email' })
      .then((credentials) => console.log(credentials))
      .catch((error) => console.log(error));
    // NativeModules.A0Auth0.showUrl('https://dev-mr5werjm.us.auth0.com', true, false, (e, r) => {
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
    console.log(Object.keys(NativeModules));
  }
  callbackTest() {
    console.log('to do');
  }
}
