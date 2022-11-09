#import "TestModuleExample.h"
#import "NativeScript/Test.h"

@implementation TestModuleExample
- (void )hello {
  TestModule * module = [[TestModule alloc] init];
  [module helloWorldInstaller];
}

@end
