// This config is for building dist files
const chalk = require('chalk');
const RemovePlugin = require('remove-files-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const getWebpackConfig = require('./antd-tools/getWebpackConfig');
const darkVars = require('./scripts/dark-vars');
const compactVars = require('./scripts/compact-vars');
function injectLessVariables(config, variables) {
  (Array.isArray(config) ? config : [config]).forEach(conf => {
    conf.module.rules.forEach(rule => {
      // filter less rule
      if (rule.test instanceof RegExp && rule.test.test('.less')) {
        const lessRule = rule.use[rule.use.length - 1];
        if (lessRule.options.lessOptions) {
          lessRule.options.lessOptions.modifyVars = {
            ...lessRule.options.lessOptions.modifyVars,
            ...variables,
          };
        } else {
          lessRule.options.modifyVars = {
            ...lessRule.options.modifyVars,
            ...variables,
          };
        }
      }
    });
  });

  return config;
}

function addLocales(webpackConfig) {
  let packageName = 'antd-with-locales';
  if (webpackConfig.entry['antd.min']) {
    packageName += '.min';
  }
  webpackConfig.entry[packageName] = './index-with-locales.js';
  webpackConfig.output.filename = '[name].js';
}

function externalDayjs(config) {
  config.externals.push({
    dayjs: {
      root: 'dayjs',
      commonjs2: 'dayjs',
      commonjs: 'dayjs',
      amd: 'dayjs',
    },
  });
  config.externals.push(function ({ _context, request }, callback) {
    if (/^dayjs\/plugin\//.test(request)) {
      const name = request.replaceAll('/', '_');
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

function processWebpackThemeConfig(themeConfig, theme, vars) {
  themeConfig.forEach(config => {
    externalDayjs(config);

    // rename default entry to ${theme} entry
    Object.keys(config.entry).forEach(entryName => {
      const originPath = config.entry[entryName];
      let replacedPath = [...originPath];

      // We will replace `./index` to `./index-style-only` since theme dist only use style file
      if (originPath.length === 1 && originPath[0] === './index') {
        replacedPath = ['./index-style-only'];
      } else {
        // eslint-disable-next-line no-console
        console.log(chalk.red('🆘 Seems entry has changed! It should be `./index`'));
      }

      config.entry[entryName.replace('antd', `antd.${theme}`)] = replacedPath;
      delete config.entry[entryName];
    });

    // apply ${theme} less variables
    injectLessVariables(config, vars);
    // ignore emit ${theme} entry js & js.map file
    config.plugins.push(
      new RemovePlugin({
        after: {
          root: './dist',
          include: [
            `antd.${theme}.js`,
            `antd.${theme}.js.map`,
            `antd.${theme}.min.js`,
            `antd.${theme}.min.js.map`,
          ],
          log: false,
          logWarning: false,
        },
      }),
    );
  });
}

const legacyEntryVars = {
  'root-entry-name': 'default',
};
const webpackConfig = injectLessVariables(getWebpackConfig(false), legacyEntryVars);
const webpackDarkConfig = injectLessVariables(getWebpackConfig(false), legacyEntryVars);
const webpackCompactConfig = injectLessVariables(getWebpackConfig(false), legacyEntryVars);
const webpackVariableConfig = injectLessVariables(getWebpackConfig(false), {
  'root-entry-name': 'variable',
});

webpackConfig.forEach(config => {
  injectWarningCondition(config);
});

if (process.env.RUN_ENV === 'PRODUCTION') {
  webpackConfig.forEach(config => {
    externalDayjs(config);
    addLocales(config);
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

  processWebpackThemeConfig(webpackDarkConfig, 'dark', darkVars);
  processWebpackThemeConfig(webpackCompactConfig, 'compact', compactVars);
  processWebpackThemeConfig(webpackVariableConfig, 'variable', {});
}

module.exports = [
  ...webpackConfig,
  ...webpackDarkConfig,
  ...webpackCompactConfig,
  ...webpackVariableConfig,
];
