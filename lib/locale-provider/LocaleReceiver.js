'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: {
    componentName: _vueTypes2['default'].string,
    defaultLocale: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
    children: _vueTypes2['default'].func
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
      return (0, _extends3['default'])({}, typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale, localeFromContext || {});
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
module.exports = exports['default'];