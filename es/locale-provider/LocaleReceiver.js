import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';

export default {
  props: {
    componentName: PropTypes.string,
    defaultLocale: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    children: PropTypes.func
  },
  inject: {
    localeData: { 'default': {} }
  },
  methods: {
    getLocale: function getLocale() {
      var componentName = this.componentName,
          defaultLocale = this.defaultLocale;
      var antLocale = this.localeData.antLocale;

      var localeFromContext = antLocale && antLocale[componentName];
      return _extends({}, typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale, localeFromContext || {});
    },
    getLocaleCode: function getLocaleCode() {
      var antLocale = this.localeData.antLocale;

      var localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return 'en-us';
      }
      return localeCode;
    }
  },

  render: function render() {
    var $scopedSlots = this.$scopedSlots;

    var children = this.children || $scopedSlots['default'];
    return children(this.getLocale(), this.getLocaleCode());
  }
};