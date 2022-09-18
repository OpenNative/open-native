const path = require('path');
const pluginDir = path.dirname(__dirname);
const hook = require('@nativescript/hook')(pluginDir);

/**
 * By calling this, each entry specified in the `nativescript.hooks` field in this
 * plugin's package.json will be written into the app's own "hooks" folder with a
 * sanitised name corresponding to the project and into a subfolder that
 * corresponds to the hook.
 * @example demo-react/hooks/after-prepare/nativescript-community-expo-nativescript-adapter.js
 * @see @nativescript/hook/index.js
 */
hook.postinstall();
