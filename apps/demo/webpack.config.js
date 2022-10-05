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
      .rule('customjs')
      .test(/\.js$/)
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['module:metro-react-native-babel-preset'],
      });
  });

  return webpack.resolveConfig();
};
