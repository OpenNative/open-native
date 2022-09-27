import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedReactNativeAutolinking } from '@demo/shared';
import {} from '@ammarahm-ed/react-native-autolinking';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedReactNativeAutolinking {}
