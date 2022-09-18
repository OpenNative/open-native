import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'react-native', loadChildren: () => import('./plugin-demos/react-native.module').then((m) => m.ReactNativeModule) },
  { path: 'react-native-module-test', loadChildren: () => import('./plugin-demos/react-native-module-test.module').then((m) => m.ReactNativeModuleTestModule) },
  { path: 'react-native-podspecs', loadChildren: () => import('./plugin-demos/react-native-podspecs.module').then((m) => m.ReactNativePodspecsModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
