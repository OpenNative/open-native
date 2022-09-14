import { Component, NgZone } from '@angular/core';
import { DemoSharedReactNativePodspecs } from '@demo/shared';
import {} from '@ammarahm-ed/react-native-podspecs';

@Component({
  selector: 'demo-react-native-podspecs',
  templateUrl: 'react-native-podspecs.component.html',
})
export class ReactNativePodspecsComponent {
  demoShared: DemoSharedReactNativePodspecs;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedReactNativePodspecs();
  }
}
