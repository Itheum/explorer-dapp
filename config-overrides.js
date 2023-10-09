const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = function override(config) {
  let appVersion = new HtmlWebpackPlugin({
    title: "Caching",
  });
  console.log("override");
  console.log(appVersion, "HtmlPack");
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
  };

  config.output.filename = `./static/js/main.${process.env.REACT_APP_VERSION}.js`;
  config.output.chunkFilename = `./static/js/main.${process.env.REACT_APP_VERSION}.chunk.js`;

  return config;
};
