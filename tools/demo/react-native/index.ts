import { DemoSharedBase } from '../utils';
//@ts-ignore
import Auth0 from 'react-native-auth0';
import { NativeModules } from '@ammarahm-ed/react-native';
const auth0 = new Auth0({ domain: 'https://dev-mr5werjm.us.auth0.com', clientId: 'xbUxJUQ5ofi7qoRHn3YjZp6A1f7qdZ5n' });
export class DemoSharedReactNative extends DemoSharedBase {
  loadBridge() {
    console.log('NativeModules.A0Auth0:', NativeModules.A0Auth0);
    console.log('auth0.webAuth:', auth0.webAuth);
    auth0.webAuth
      .authorize({ scope: 'openid profile email' })
      .then((credentials) =>
        // Successfully authenticated
        // Store the accessToken
        console.log('DONE')
      )
      .catch((error) => console.log(error.stack, 'ERROR'));

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
    console.log(Object.keys(NativeModules));
  }
  callbackTest() {
    console.log('to do');
  }
}
