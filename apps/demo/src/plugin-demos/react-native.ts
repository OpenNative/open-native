import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedReactNative } from '@demo/shared';
import {} from '@@ammarahm-ed/react-native';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedReactNative {}
