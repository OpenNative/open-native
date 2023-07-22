const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('typescript');

  webpack.chainWebpack((config) => {
    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));
    config.resolve.alias.set('react-native', '@open-native/core');
    config.resolve.alias.set('crypto', 'crypto-js');

    config.entry('application').add('./application.android');

    config.module
      .rule('rnmodules')
      // .include.add(/node_modules(.*[/\\])+react-native-module/)
      // .end()
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
