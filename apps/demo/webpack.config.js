const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('typescript');

  webpack.chainWebpack((config) => {
    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));
    config.resolve.alias.set('react-native', '@ammarahm-ed/react-native');
    config.resolve.alias.set('crypto', require.resolve('crypto-js'));

    config.module
      .rule('rnmodules')
      .include.add(/node_modules(.*[/\\])+react-native-auth0/)
      .end()
      .use('babel-loader')
      .before('ts-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['module:metro-react-native-babel-preset'],
      });
  });

  return webpack.resolveConfig();
};
