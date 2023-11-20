module.exports = function override(config) {
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
  };

  return config;
};
