'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.getComponentLocale = getComponentLocale;
exports.getLocaleCode = getLocaleCode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getComponentLocale(props, context, componentName, getDefaultLocale) {
  var locale = {};
  if (context && context.antLocale && context.antLocale[componentName]) {
    locale = context.antLocale[componentName];
  } else {
    var defaultLocale = getDefaultLocale();
    // TODO: make default lang of antd be English
    // https://github.com/ant-design/ant-design/issues/6334
    locale = defaultLocale['default'] || defaultLocale;
  }

  var result = (0, _extends3['default'])({}, locale, props.locale);
  result.lang = (0, _extends3['default'])({}, locale.lang, props.locale.lang);
  return result;
}

function getLocaleCode(context) {
  var localeCode = context.antLocale && context.antLocale.locale;
  // Had use LocaleProvide but didn't set locale
  if (context.antLocale && context.antLocale.exist && !localeCode) {
    return 'zh-cn';
  }
  return localeCode;
}