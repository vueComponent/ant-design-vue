// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

const webpack = require('webpack')
const webpackConfig = require('../webpack.config')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage-istanbul'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap', 'coverage'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                js: 'babel-loader',
              },
              postLoaders: {
                js: 'istanbul-instrumenter-loader?esModules=true',
              },
            },
          },
          {
            test: /\.js$/,
            loader: 'babel-loader', exclude: /node_modules/,
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
            },
          },
          {
            test: /\.less$/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: { sourceMap: true },
              },
              { loader: 'less-loader',
                options: { sourceMap: true },
              },
            ],
          },
        ],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'text-summary' },
      ],
    },
  })
}
