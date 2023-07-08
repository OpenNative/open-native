
export interface ViewManagers {
  "ModuleTestViewManager":{
      
/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "color") public void setColor(View view, String color);
```
*/
color: string;
  }
"RNCWebViewManager":{
      
/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "allowFileAccess") public void setAllowFileAccess(RNCWebView view, boolean value);
```
*/
allowFileAccess: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "allowFileAccessFromFileURLs") public void setAllowFileAccessFromFileURLs(RNCWebView view, boolean value);
```
*/
allowFileAccessFromFileURLs: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "allowUniversalAccessFromFileURLs") public void setAllowUniversalAccessFromFileURLs(RNCWebView view, boolean value);
```
*/
allowUniversalAccessFromFileURLs: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "allowsFullscreenVideo") public void setAllowsFullscreenVideo(RNCWebView view, boolean value);
```
*/
allowsFullscreenVideo: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "allowsProtectedMedia") public void setAllowsProtectedMedia(RNCWebView view, boolean value);
```
*/
allowsProtectedMedia: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "androidLayerType") public void setAndroidLayerType(RNCWebView view, @Nullable String value);
```
*/
androidLayerType: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "applicationNameForUserAgent") public void setApplicationNameForUserAgent(RNCWebView view, @Nullable String value);
```
*/
applicationNameForUserAgent: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "basicAuthCredential") public void setBasicAuthCredential(RNCWebView view, @Nullable ReadableMap value);
```
*/
basicAuthCredential: any;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "cacheEnabled") public void setCacheEnabled(RNCWebView view, boolean value);
```
*/
cacheEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "cacheMode") public void setCacheMode(RNCWebView view, @Nullable String value);
```
*/
cacheMode: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "domStorageEnabled") public void setDomStorageEnabled(RNCWebView view, boolean value);
```
*/
domStorageEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "downloadingMessage") public void setDownloadingMessage(RNCWebView view, @Nullable String value);
```
*/
downloadingMessage: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "forceDarkOn") public void setForceDarkOn(RNCWebView view, boolean value);
```
*/
forceDarkOn: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "geolocationEnabled") public void setGeolocationEnabled(RNCWebView view, boolean value);
```
*/
geolocationEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "hasOnScroll") public void setHasOnScroll(RNCWebView view, boolean hasScrollEvent);
```
*/
hasOnScroll: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "incognito") public void setIncognito(RNCWebView view, boolean value);
```
*/
incognito: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "injectedJavaScript") public void setInjectedJavaScript(RNCWebView view, @Nullable String value);
```
*/
injectedJavaScript: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "injectedJavaScriptBeforeContentLoaded") public void setInjectedJavaScriptBeforeContentLoaded(RNCWebView view, @Nullable String value);
```
*/
injectedJavaScriptBeforeContentLoaded: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "injectedJavaScriptForMainFrameOnly") public void setInjectedJavaScriptForMainFrameOnly(RNCWebView view, boolean value);
```
*/
injectedJavaScriptForMainFrameOnly: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "injectedJavaScriptBeforeContentLoadedForMainFrameOnly") public void setInjectedJavaScriptBeforeContentLoadedForMainFrameOnly(RNCWebView view, boolean value);
```
*/
injectedJavaScriptBeforeContentLoadedForMainFrameOnly: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "javaScriptCanOpenWindowsAutomatically") public void setJavaScriptCanOpenWindowsAutomatically(RNCWebView view, boolean value);
```
*/
javaScriptCanOpenWindowsAutomatically: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "lackPermissionToDownloadMessage") public void setLackPermissionToDownloadMessage(RNCWebView view, @Nullable String value);
```
*/
lackPermissionToDownloadMessage: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "mediaPlaybackRequiresUserAction") public void setMediaPlaybackRequiresUserAction(RNCWebView view, boolean value);
```
*/
mediaPlaybackRequiresUserAction: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "menuItems") public void setMenuItems(RNCWebView view, @Nullable ReadableArray items);
```
*/
menuItems: any;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "messagingEnabled") public void setMessagingEnabled(RNCWebView view, boolean value);
```
*/
messagingEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "messagingModuleName") public void setMessagingModuleName(RNCWebView view, @Nullable String value);
```
*/
messagingModuleName: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "minimumFontSize") public void setMinimumFontSize(RNCWebView view, int value);
```
*/
minimumFontSize: number;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "mixedContentMode") public void setMixedContentMode(RNCWebView view, @Nullable String value);
```
*/
mixedContentMode: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "nestedScrollEnabled") public void setNestedScrollEnabled(RNCWebView view, boolean value);
```
*/
nestedScrollEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "overScrollMode") public void setOverScrollMode(RNCWebView view, @Nullable String value);
```
*/
overScrollMode: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "saveFormDataDisabled") public void setSaveFormDataDisabled(RNCWebView view, boolean value);
```
*/
saveFormDataDisabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "scalesPageToFit") public void setScalesPageToFit(RNCWebView view, boolean value);
```
*/
scalesPageToFit: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "setBuiltInZoomControls") public void setSetBuiltInZoomControls(RNCWebView view, boolean value);
```
*/
setBuiltInZoomControls: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "setDisplayZoomControls") public void setSetDisplayZoomControls(RNCWebView view, boolean value);
```
*/
setDisplayZoomControls: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "setSupportMultipleWindows") public void setSetSupportMultipleWindows(RNCWebView view, boolean value);
```
*/
setSupportMultipleWindows: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "showsHorizontalScrollIndicator") public void setShowsHorizontalScrollIndicator(RNCWebView view, boolean value);
```
*/
showsHorizontalScrollIndicator: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "showsVerticalScrollIndicator") public void setShowsVerticalScrollIndicator(RNCWebView view, boolean value);
```
*/
showsVerticalScrollIndicator: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "newSource") public void setNewSource(RNCWebView view, @Nullable ReadableMap value);
```
*/
newSource: any;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "textZoom") public void setTextZoom(RNCWebView view, int value);
```
*/
textZoom: number;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "thirdPartyCookiesEnabled") public void setThirdPartyCookiesEnabled(RNCWebView view, boolean value);
```
*/
thirdPartyCookiesEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "webviewDebuggingEnabled") public void setWebviewDebuggingEnabled(RNCWebView view, boolean value);
```
*/
webviewDebuggingEnabled: boolean;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "userAgent") public void setUserAgent(RNCWebView view, @Nullable String value);
```
*/
userAgent: string;

/**
Native definition for this prop in Java:
```java
/@ReactProp(name = "javaScriptEnabled") public void setJavaScriptEnabled(RNCWebView view, boolean enabled);
```
*/
javaScriptEnabled: boolean;
  }
}