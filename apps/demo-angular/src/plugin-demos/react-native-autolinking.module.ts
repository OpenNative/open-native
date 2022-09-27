import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { ReactNativeAutolinkingComponent } from './react-native-autolinking.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: ReactNativeAutolinkingComponent }])],
  declarations: [ReactNativeAutolinkingComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReactNativeAutolinkingModule {}
