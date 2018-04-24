// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const merge = require('webpack-merge')
delete webpackConfig.entry
const scope = process.argv[5] || ''
process.env.CHROME_BIN = require('puppeteer').executablePath()
function resolve (basePath, suiteName = '') {
  return path.join(basePath, '../components', suiteName.toLowerCase(), '__test__/__snapshots__', 'index.test.md')
}
module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'snapshot', 'mocha-snapshot', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['../components/**/__snapshots__/**/*.md', './index.js'],
    preprocessors: {
      '../components/**/__snapshots__/**/*.md': ['snapshot'],
      './index.js': ['webpack', 'sourcemap'],
    },
    port: 9876,
    colors: true,
    // autoWatch: true,
    webpack: merge(
      {
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"testing"',
              SCOPE: `"${scope}"`,
            },
          }),
        ],
      },
      webpackConfig
    ),
    webpackMiddleware: {
      noInfo: true,
    },
    snapshot: {
      update: !!process.env.UPDATE,
      prune: !!process.env.PRUNE,
      pathResolver: resolve, // Custom path resolver,
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' },
      ],
      includeAllSources: false,
    },
  })
}
