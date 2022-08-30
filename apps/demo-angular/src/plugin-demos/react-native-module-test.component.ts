import { Component, NgZone } from '@angular/core';
import { DemoSharedReactNativeModuleTest } from '@demo/shared';
import {} from '@@ammarahm-ed/react-native-module-test';

@Component({
  selector: 'demo-react-native-module-test',
  templateUrl: 'react-native-module-test.component.html',
})
export class ReactNativeModuleTestComponent {
  demoShared: DemoSharedReactNativeModuleTest;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedReactNativeModuleTest();
  }
}
