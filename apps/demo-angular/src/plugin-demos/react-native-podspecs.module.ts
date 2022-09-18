import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { ReactNativePodspecsComponent } from './react-native-podspecs.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: ReactNativePodspecsComponent }])],
  declarations: [ReactNativePodspecsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReactNativePodspecsModule {}
