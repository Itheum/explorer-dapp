module.exports = function override(config) {
  console.log('override');
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify')
  };

  return config;
};
