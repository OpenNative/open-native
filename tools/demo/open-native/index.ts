import { DemoSharedBase } from '../utils';

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now();

  await action();

  const stop = performance.now();
  console.log(`${stop - start} ms (${name})`);
}
export class DemoSharedOpenNative extends DemoSharedBase {
  testPromise() {
    //@ts-ignore
    //const module = new JSIModule();
    if (!global.JSIModuleImpl) {
      //@ts-ignore
      const module = new JSIModule();
      console.log(module.install());
      console.log('creating module');
    }
    console.log(global.JSIModuleImpl.test());
    //console.log(global.MyModule.helloWorld());

    // const testPromise = async () => {
    //   for (let i = 0; i < 5000; i++) {
    //     await NativeModules.RNTestModuleAliased.testPromise();
    //   }
    // };
    // measure('promise', testPromise);
  }
}
