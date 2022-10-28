import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedReactNative } from '@demo/shared';
// import {} from 'open-native';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedReactNative {}
