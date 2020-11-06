const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
require('dotenv').config();
const webpack = require('webpack');

const dev = process.env.NODE_ENV !== 'production';

module.exports = withLess(
  withCSS({
    /* config options here */
    webpack: (config) => {
      config.plugins.push(new webpack.EnvironmentPlugin(process.env));
      return config;
    },
    assetPrefix: !dev ? process.env.CDN_URL || '' : '',
  })
);
