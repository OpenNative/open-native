const resolvePackagePath =
  require('@rigor789/resolve-package-path').resolvePackagePath;
module.exports = (webpack) => {
  webpack.chainWebpack((config) => {
    config.resolve.alias.set('react-native', '@open-native/core');
    const reactPackagePath = resolvePackagePath('react');
    if (!reactPackagePath) {
      console.log('webpack: react polyfill installed');
      config.resolve.alias.set('react', '@open-native/core/polyfills/react.js');
    }
  });
};
