const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
require('dotenv').config();
const webpack = require('webpack');

const dev = process.env.NODE_ENV !== 'production';

module.exports = withLess(
  withCSS({
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }

      config.plugins.push(new webpack.EnvironmentPlugin(process.env));

      config.module.rules.push({
        test: require.resolve('uikit'),
        loader: 'expose-loader?UIkit',
      });
      return config;
    },
    assetPrefix: !dev ? process.env.CDN_URL || '' : '',
  })
);
