module.exports = (webpack) => {
  webpack.chainWebpack((config) => {
    config.resolve.alias.set('react-native', '@open-native/core');
  });
};
