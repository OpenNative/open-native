import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { ReactNativeComponent } from './react-native.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: ReactNativeComponent }])],
  declarations: [ReactNativeComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReactNativeModule {}
