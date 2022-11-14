import { DemoSharedBase } from '../utils';
import { NativeModules } from '@open-native/core';
//@ts-ignore
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: 'https://dev-mr5werjm.us.auth0.com', clientId: 'xbUxJUQ5ofi7qoRHn3YjZp6A1f7qdZ5n' });

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  await action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}

export class DemoSharedOpenNative extends DemoSharedBase {
  testPromise() {
    const testPromise = async () => {
      for (let i = 0; i < 5000; i++) {
        await NativeModules.RNTestModuleAliased.testPromise();
      }
    };
    measure('promise', testPromise);
  }

  tryAuth0() {
    auth0.webAuth
      .authorize({ scope: 'openid profile email' })
      .then((credentials) => console.log(credentials))
      .catch((error) => console.log(error));
  }
}
