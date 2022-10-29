import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedReactNativeModuleTest } from '@demo/shared';
import {} from 'react-native-module-test';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedReactNativeModuleTest {}
