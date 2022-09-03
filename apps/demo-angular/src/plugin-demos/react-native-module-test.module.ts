import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { ReactNativeModuleTestComponent } from './react-native-module-test.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: ReactNativeModuleTestComponent }])],
  declarations: [ReactNativeModuleTestComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReactNativeModuleTestModule {}
