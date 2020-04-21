const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
require('dotenv').config();
const webpack = require('webpack');

module.exports = withLess(
  withCSS({
    /* config options here */
    webpack: (config) => {
      config.plugins.push(new webpack.EnvironmentPlugin(process.env));
      return config;
    },
  })
);
