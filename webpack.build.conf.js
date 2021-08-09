// This config is for building dist files
const getWebpackConfig = require('./antd-tools/getWebpackConfig');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const darkVars = require('./scripts/dark-vars');

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
    root: 'dayjs',
    commonjs2: 'dayjs',
    commonjs: 'dayjs',
    amd: 'dayjs',
  };
}

const webpackConfig = getWebpackConfig(false);
if (process.env.RUN_ENV === 'PRODUCTION') {
  webpackConfig.forEach(config => {
    externalDayjs(config);
    addLocales(config);
  });
}

const webpackDarkConfig = getWebpackConfig(false);

webpackDarkConfig.forEach(config => {
  externalDayjs(config);

  // rename default entry to ${theme} entry
  Object.keys(config.entry).forEach(entryName => {
    config.entry[entryName.replace('antd', `antd.dark`)] = config.entry[entryName];
    delete config.entry[entryName];
  });

  // apply ${theme} less variables
  config.module.rules.forEach(rule => {
    // filter less rule
    if (rule.test instanceof RegExp && rule.test.test('.less')) {
      const lessRule = rule.use[rule.use.length - 1];
      if (lessRule.options.lessOptions) {
        lessRule.options.lessOptions.modifyVars = darkVars;
      } else {
        lessRule.options.modifyVars = darkVars;
      }
    }
  });

  const themeReg = new RegExp(`dark(.min)?\\.js(\\.map)?`);
  // ignore emit ${theme} entry js & js.map file
  config.plugins.push(new IgnoreEmitPlugin(themeReg));
});

module.exports = webpackConfig.concat(webpackDarkConfig);
