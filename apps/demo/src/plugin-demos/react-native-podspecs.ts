import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedReactNativePodspecs } from '@demo/shared';
import {} from '@ammarahm-ed/react-native-podspecs';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedReactNativePodspecs {}
