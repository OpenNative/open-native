import { EventData, Page } from '@nativescript/core';
import { DemoSharedOpenNative } from '@demo/shared';
// import {} from '@open-native/core';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export function loadingFinish(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
  console.log('loading');
}

export function onLoaded(data) {
  console.log('loading finish called', data.nativeEvent);
}

export class DemoModel extends DemoSharedOpenNative {}
