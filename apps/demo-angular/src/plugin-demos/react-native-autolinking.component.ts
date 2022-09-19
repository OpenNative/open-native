import { Component, NgZone } from '@angular/core';
import { DemoSharedReactNativeAutolinking } from '@demo/shared';
import {} from '@ammarahm-ed/react-native-autolinking';

@Component({
  selector: 'demo-react-native-autolinking',
  templateUrl: 'react-native-autolinking.component.html',
})
export class ReactNativeAutolinkingComponent {
  demoShared: DemoSharedReactNativeAutolinking;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedReactNativeAutolinking();
  }
}
