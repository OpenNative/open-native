import { Component } from '@angular/core';

@Component({
  selector: 'demo-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  demos = [
    {
      name: 'react-native',
    },
    {
      name: 'react-native-module-test',
    },
  ];
}
