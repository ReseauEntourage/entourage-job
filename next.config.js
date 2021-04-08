const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');

const loadEnvironementVariables = require('./backend/utils/env');

loadEnvironementVariables();

const dev = process.env.NODE_ENV !== 'production';

module.exports = withLess(
  withCSS({
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }

      config.plugins.push(new webpack.EnvironmentPlugin(process.env));

      config.plugins.push(
        new CircularDependencyPlugin({
          // exclude detection of files based on a RegExp
          exclude: /a\.js|node_modules/,
          // add errors to webpack instead of warnings
          failOnError: true,
          // allow import cycles that include an asyncronous import,
          // e.g. via import(/* webpackMode: "weak" */ './file.js')
          allowAsyncCycles: false,
          // set the current working directory for displaying module paths
          cwd: process.cwd(),
        })
      );

      config.module.rules.push({
        test: require.resolve('uikit'),
        loader: 'expose-loader?UIkit',
      });
      return config;
    },
    assetPrefix: !dev ? process.env.CDN_URL || '' : '',
  })
);
