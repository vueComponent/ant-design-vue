'use strict'

module.exports = function (modules) {
  const plugins = [
    'babel-plugin-transform-vue-jsx',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-syntax-dynamic-import',
    'babel-plugin-transform-decorators-legacy',
  ]

  return {
    presets: ['babel-preset-env'],
    plugins,
  }
}
