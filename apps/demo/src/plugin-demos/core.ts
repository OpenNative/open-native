import { EventData, Page } from '@nativescript/core';
import { DemoSharedOpenNative } from '@demo/shared';
// import {} from '@open-native/core';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedOpenNative {
  sourceValue: {
    html: '<p>hello world</p>';
  };
}
