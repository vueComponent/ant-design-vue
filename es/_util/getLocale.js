import _extends from 'babel-runtime/helpers/extends';
export function getComponentLocale(props, context, componentName, getDefaultLocale) {
  var locale = {};
  if (context && context.antLocale && context.antLocale[componentName]) {
    locale = context.antLocale[componentName];
  } else {
    var defaultLocale = getDefaultLocale();
    // TODO: make default lang of antd be English
    // https://github.com/ant-design/ant-design/issues/6334
    locale = defaultLocale['default'] || defaultLocale;
  }

  var result = _extends({}, locale, props.locale);
  result.lang = _extends({}, locale.lang, props.locale.lang);
  return result;
}

export function getLocaleCode(context) {
  var localeCode = context.antLocale && context.antLocale.locale;
  // Had use LocaleProvide but didn't set locale
  if (context.antLocale && context.antLocale.exist && !localeCode) {
    return 'zh-cn';
  }
  return localeCode;
}