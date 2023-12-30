import { View } from '@nativescript/core';
import { requireNativeComponent } from '@open-native/core';
import { ViewProps } from 'react-native';
import { WebViewProps } from 'react-native-webview';

type WebViewProperties = Omit<WebViewProps, keyof ViewProps | 'onFileDownload' | 'onNavigationStateChange' | 'onContentSizeChange' | 'onLoadProgress' | 'onRenderProcessGone' | 'onError' | 'onLoad' | 'onLoadEnd' | 'onLoadStart' | 'onLoadFinish' | 'onLoadError' | 'onLoadingProgress' | 'onHttpError' | 'onShouldStartLoadWithRequest' | 'onContentProcessDidTerminate' | 'onOpenWindow' | 'onMessage' | 'onScroll' | 'onCustomMenuSelection'>;

export type WebViewNativeEvents = 'fileDownload' | 'loadingStart' | 'loadingFinish' | 'loadingError' | 'loadingProgress' | 'httpError' | 'shouldStartLoadWithRequest' | 'contentProcessDidTerminate' | 'openWindow' | 'message' | 'scroll' | 'customMenuSelection' | 'renderProcessGone';

type WebViewCommands = {
  /**
   * Go back one page in the webview's history.
   */
  goBack: () => void;

  /**
   * Go forward one page in the webview's history.
   */
  goForward: () => void;

  /**
   * Reloads the current page.
   */
  reload: () => void;

  /**
   * Stop loading the current page.
   */
  stopLoading(): void;

  /**
   * Executes the JavaScript string.
   */
  injectJavaScript: (script: string) => void;

  /**
   * Focuses on WebView redered page.
   */
  requestFocus: () => void;

  loadUrl: (url: string) => void;

  /**
   * Posts a message to WebView.
   */
  postMessage: (message: string) => void;

  /**
   * (Android only)
   * Removes the autocomplete popup from the currently focused form field, if present.
   */
  clearFormData?: () => void;

  /**
   * (Android only)
   * Clears the resource cache. Note that the cache is per-application, so this will clear the cache for all WebViews used.
   */
  clearCache?: (clear: boolean) => void;

  /**
   * (Android only)
   * Tells this WebView to clear its internal back/forward list.
   */
  clearHistory?: () => void;
};

interface NativeScriptWebViewBaseInterface {
  prototype: View & WebViewProperties & WebViewCommands;
  new (): View & WebViewProperties & WebViewCommands;
}

export const NativeScriptWebViewCommon = requireNativeComponent('RNCWebView') as NativeScriptWebViewBaseInterface;
