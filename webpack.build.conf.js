// This config is for building dist files
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const getWebpackConfig = require('./antd-tools/getWebpackConfig');

function addLocales(webpackConfig) {
  let packageName = 'antd-with-locales';
  if (webpackConfig.entry['antd.min']) {
    packageName += '.min';
  }
  webpackConfig.entry[packageName] = './index-with-locales.js';
  webpackConfig.output.filename = '[name].js';
}

function externalDayjs(config) {
  config.externals.dayjs = {
    dayjs: {
      root: 'dayjs',
      commonjs2: 'dayjs',
      commonjs: 'dayjs',
      amd: 'dayjs',
    },
  };
  config.externals.push(function ({ _context, request }, callback) {
    if (/^dayjs\/plugin\//.test(request)) {
      const name = request.replace(/\//g, '_');
      return callback(null, {
        root: name,
        commonjs2: name,
        commonjs: name,
        amd: name,
      });
    }
    callback();
  });
}

function injectWarningCondition(config) {
  config.module.rules.forEach(rule => {
    // Remove devWarning if needed
    if (rule.test.test('test.tsx')) {
      rule.use = [
        ...rule.use,
        {
          loader: 'string-replace-loader',
          options: {
            search: 'devWarning(',
            replace: "if (process.env.NODE_ENV !== 'production') devWarning(",
          },
        },
      ];
    }
  });
}

const webpackConfig = getWebpackConfig(false);
const webpackESMConfig = getWebpackConfig(false, true);

webpackConfig.forEach(config => {
  injectWarningCondition(config);
});

if (process.env.RUN_ENV === 'PRODUCTION') {
  webpackConfig.forEach(config => {
    addLocales(config);
    externalDayjs(config);
    // Reduce non-minified dist files size
    config.optimization.usedExports = true;
    // use esbuild
    if (process.env.ESBUILD || process.env.CSB_REPO) {
      config.optimization.minimizer[0] = new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      });
    }
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: '../report.html',
      }),
    );

    if (!process.env.NO_DUP_CHECK) {
      config.plugins.push(
        new DuplicatePackageCheckerPlugin({
          verbose: true,
          emitError: true,
        }),
      );
    }
  });
}

module.exports = [...webpackConfig, ...webpackESMConfig];
