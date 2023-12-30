import { EventData, GestureTypes, ShownModallyData } from '@nativescript/core';
import { BatchedBridge, Linking, NativeModules } from '@open-native/core';
import { NativeScrollEvent } from 'react-native';
import { WebViewCustomMenuSelectionEvent, WebViewNativeEvent, WebViewNativeProgressEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { FileDownload, ShouldStartLoadRequest, WebViewError, WebViewHttpError, WebViewMessage, WebViewNavigation, WebViewOpenWindow, WebViewRenderProcessGoneDetail } from 'react-native-webview/lib/WebViewTypes';
import { NativeScriptWebViewCommon, WebViewNativeEvents } from './common';
import { compileWhitelist, passesWhitelist } from './utils';

export interface NativeEventData<T = any> extends EventData {
  nativeEvent: T;
}

export type WebViewMessageEventData = NativeEventData<WebViewMessage>;
export type ShouldStartLoadRequestEventData = NativeEventData<ShouldStartLoadRequest>;
export type WebViewNavigationEventData = NativeEventData<WebViewNavigation>;
export type WebViewErrorEventData = NativeEventData<WebViewError>;
export type WebViewScrollEventData = NativeEventData<NativeScrollEvent>;
export type WebViewFileDownloadEventData = NativeEventData<FileDownload>;
export type WebViewNativeProgressEventData = NativeEventData<WebViewNativeProgressEvent>;
export type WebViewHttpErrorEventData = NativeEventData<WebViewHttpError>;
export type WebViewNativeEventData = NativeEventData<WebViewNativeEvent>;
export type WebViewOpenWindowEventData = NativeEventData<WebViewOpenWindow>;
export type WebViewCustomMenuSelectionEventData = NativeEventData<WebViewCustomMenuSelectionEvent>;
export type WebViewRenderProcessGoneEventData = NativeEventData<WebViewRenderProcessGoneDetail>;

let uniqueRef = 0;
export class WebView extends NativeScriptWebViewCommon {
  startUrl: string;
  lastErrorEvent: WebViewError;
  messagingModuleName: string;

  public static navigationStateChangedEvent = 'navigationStateChange';
  public static shouldStartLoadEvent = 'shouldStartLoad';
  public static loadEvent = 'load';
  public static loadEndEvent = 'loadEnd';

  constructor() {
    super();

    this.cacheEnabled = true;
    this.javaScriptEnabled = true;
    //@ts-ignore
    this.originWhitelist = defaultOriginWhitelist;

    if (__IOS__) {
      this.useSharedProcessPool = true;
      this.textInteractionEnabled = true;
      this.injectedJavaScriptForMainFrameOnly = true;
      this.injectedJavaScriptBeforeContentLoadedForMainFrameOnly = true;
      
      this.on('shouldStartLoadWithRequest', this.onShouldStartLoadWithRequest);
    }

    if (__ANDROID__) {
      this.overScrollMode = 'always';
      this.thirdPartyCookiesEnabled = true;
      this.scalesPageToFit = true;
      this.allowsFullscreenVideo = false;
      this.allowFileAccess = false;
      this.saveFormDataDisabled = false;
      this.androidLayerType = 'none';
      this.setSupportMultipleWindows = true;
      this.setBuiltInZoomControls = true;
      this.setDisplayZoomControls = false;
      this.nestedScrollEnabled = false;
      this.messagingModuleName = `WebViewMessageHandler${(uniqueRef += 1)}`;

      BatchedBridge.registerCallableModule(this.messagingModuleName, {
        onMessage: (data: WebViewMessageEventData) => {
          this.notify({
            eventName: 'message',
            object: this,
            nativeEvent: data,
          });
        },
        onShouldStartLoadWithRequest: this.onShouldStartLoadWithRequest,
      });
    }

    this.on('loadingStart', (args: WebViewNavigationEventData) => {
      this.startUrl = args.nativeEvent.url;
      this.updateNavigationState(args);
    });

    this.on('loadingError', (args: WebViewErrorEventData) => {
      this.lastErrorEvent = args.nativeEvent;
      this.notify({
        eventName: 'loadEnd',
        object: this,
        nativeEvent: args.nativeEvent,
      });
    });

    this.on('loadingFinish', (args: WebViewNavigationEventData) => {
      this.notify({
        eventName: 'load',
        object: this,
        nativeEvent: args.nativeEvent,
      });
      this.notify({
        eventName: 'loadEnd',
        object: this,
        nativeEvent: args.nativeEvent,
      });
      this.updateNavigationState(args);
    });
  }

  initNativeView(): void {
    super.initNativeView();
  }

  onShouldStartLoadWithRequest = (data: ShouldStartLoadRequestEventData) => {
    console.log('should start load with request', data.nativeEvent.url);
    let shouldStart = true;
    const eventObject: ShouldStartLoadRequest & {
      shouldStart?: boolean;
    } = data.nativeEvent;

    const { url, lockIdentifier } = eventObject;
    if (!passesWhitelist(compileWhitelist(this.originWhitelist), url)) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
          console.warn(`Can't open url: ${url}`);
          return undefined;
        })
        .catch((e) => {
          console.warn('Error opening URL: ', e);
        });
      shouldStart = false;
    } else if (this.hasListeners(WebView.shouldStartLoadEvent)) {
      this.notify({
        eventName: WebView.shouldStartLoadEvent,
        object: this,
        nativeEvent: eventObject,
      });
      shouldStart = eventObject.shouldStart;
    }
    if (lockIdentifier) {
      NativeModules.RNCWebView.shouldStartLoadWithLockIdentifier(shouldStart, eventObject.lockIdentifier);
    } else if (eventObject.shouldStart && this.nativeViewProtected) {
      this.loadUrl(eventObject.url);
    }
  };

  updateNavigationState(event: WebViewNavigationEventData) {
    if (this.hasListeners(WebView.navigationStateChangedEvent)) {
      this.notify({
        eventName: WebView.navigationStateChangedEvent,
        object: this,
        nativeEvent: event.nativeEvent,
      });
    }
  }

  on(eventNames: string | GestureTypes, callback: (args: EventData) => void, thisArg?: any);
  on(event: 'loaded', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'unloaded', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'androidBackPressed', callback: (args: EventData) => void, thisArg?: any);
  on(event: 'showingModally', callback: (args: ShownModallyData) => void, thisArg?: any): void;
  on(event: 'shownModally', callback: (args: ShownModallyData) => void, thisArg?: any);
  on(event: 'message', callback: (args: WebViewMessageEventData) => void, thisArg?: any);
  on(event: 'scroll', callback: (args: WebViewScrollEventData) => void, thisArg?: any);
  on(event: 'fileDownload', callback: (args: WebViewFileDownloadEventData) => void, thisArg?: any);
  on(event: 'loadingStart', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadingFinish', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadingError', callback: (args: WebViewErrorEventData) => void, thisArg?: any);
  on(event: 'loadingProgress', callback: (args: WebViewNativeProgressEventData) => void, thisArg?: any);
  on(event: 'httpError', callback: (args: WebViewHttpErrorEventData) => void, thisArg?: any);
  on(event: 'contentProcessDidTerminate', callback: (args: WebViewNativeEventData) => void, thisArg?: any);
  on(event: 'openWindow', callback: (args: WebViewOpenWindowEventData) => void, thisArg?: any);
  on(event: 'customMenuSelection', callback: (args: WebViewCustomMenuSelectionEventData) => void, thisArg?: any);
  on(event: 'renderProcessGone', callback: (args: WebViewRenderProcessGoneEventData) => void, thisArg?: any);
  on(event: 'load', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: 'loadEnd', callback: (args: WebViewNavigationEventData | WebViewErrorEventData) => void, thisArg?: any);
  on(event: 'shouldStartLoadWithRequest', callback: (args: ShouldStartLoadRequestEventData) => void, thisArg?: any);
  on(event: 'shouldStartLoadEvent', callback: (args: ShouldStartLoadRequestEventData) => void, thisArg?: any);
  on(event: 'navigationStateChange', callback: (args: WebViewNavigationEventData) => void, thisArg?: any);
  on(event: unknown, callback: unknown, thisArg?: unknown): any {
    super.on(event as any, callback as any, thisArg);
  }

  off(eventNames: string | GestureTypes | WebViewNativeEvents, callback?: (args: NativeEventData) => void, thisArg?: any) {
    super.off(eventNames, callback, thisArg);
  }

  addEventListener(arg: string | GestureTypes | WebViewNativeEvents, callback: (data: NativeEventData) => void, thisArg?: any): void {
    super.addEventListener(arg, callback, thisArg);
  }
  removeEventListener(arg: string | GestureTypes | WebViewNativeEvents, callback?: (data: NativeEventData) => void, thisArg?: any): void {
    super.removeEventListener(arg, callback, thisArg);
  }
}
