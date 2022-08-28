import { Component, NgZone } from '@angular/core';
import { DemoSharedReactNative } from '@demo/shared';
import {} from '@ammarahm-ed/react-native';

@Component({
  selector: 'demo-react-native',
  templateUrl: 'react-native.component.html',
})
export class ReactNativeComponent {
  demoShared: DemoSharedReactNative;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedReactNative();
  }
}
