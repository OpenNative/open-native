/* eslint-disable @typescript-eslint/no-unused-vars */
@NativeClass()
@JavaProxy('com.tns.NativeScriptApplication')
class Application extends com.facebook.react.ReactCustomApplication {
  public onCreate(): void {
    super.onCreate();
  }

  public attachBaseContext(baseContext: android.content.Context) {
    super.attachBaseContext(baseContext);
  }
}
