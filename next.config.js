// eslint-disable-next-line
require('dotenv').config();

const webpack = require('webpack');
const withLess = require('next-with-less');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

module.exports = withLess({
  lessOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, options) => {
    config.resolve.modules.push(__dirname);

    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react';
    }

    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

    config.plugins.push(
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow const cycles that include an asyncronous const,
        // e.g. via const(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    );

    if (!dev && process.env.HEROKU_APP_ID) {
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.HEROKU_APP_NAME,
          project: process.env.HEROKU_APP_NAME,

          include: '.',
          ignore: [
            'node_modules',
            'next.config.js',
            'jest.config.js',
            'assets',
            'static',
            'coverage',
          ],
        })
      );
    }

    config.module.rules.push({
      test: require.resolve('uikit'),
      use: ['expose-loader?UIkit'],
    });
    return config;
  },
  assetPrefix: !dev ? process.env.CDN_URL || '' : '',
});
