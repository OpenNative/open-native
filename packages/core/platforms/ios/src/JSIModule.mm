#import "JSIModule.h"
#import "NativeScript/JSIRuntime.h"

using namespace facebook::jsi;
using namespace std;

void install(Runtime &jsiRuntime) {
  
  auto helloWorld = Function::createFromHostFunction(jsiRuntime,
                                                         PropNameID::forAscii(jsiRuntime,
                                                                              "helloWorld"),
                                                         0,
                                                         [](Runtime &runtime,
                                                            const Value &thisValue,
                                                            const Value *arguments,
                                                            size_t count) -> Value {
          
      
    
          auto array = Array(runtime, 10);
            for (int i = 0; i < 5; i++) {
                array.setValueAtIndex(runtime, i, i);
            }
          return array;
      });
  
  Object module = Object(jsiRuntime);
  module.setProperty(jsiRuntime, "test", move(helloWorld));
  jsiRuntime.global().setProperty(jsiRuntime, "JSIModuleImpl", move(module));
}

@implementation JSIModule

- (void )install {
  std::shared_ptr<facebook::jsi::Runtime> rt = [JSIRuntime runtime];
  install(*rt);
}

@end

