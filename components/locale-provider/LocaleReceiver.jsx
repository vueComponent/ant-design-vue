import PropTypes from '../_util/vue-types';
import defaultLocaleData from './default';

export default {
  props: {
    componentName: PropTypes.string.def('global'),
    defaultLocale: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    children: PropTypes.func,
  },
  inject: {
    localeData: { default: () => ({}) },
  },
  methods: {
    getLocale() {
      const { componentName, defaultLocale } = this;
      const locale = defaultLocale || defaultLocaleData[componentName || 'global'];
      const { antLocale } = this.localeData;

      const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return {
        ...(typeof locale === 'function' ? locale() : locale),
        ...(localeFromContext || {}),
      };
    },

    getLocaleCode() {
      const { antLocale } = this.localeData;
      const localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return defaultLocaleData.locale;
      }
      return localeCode;
    },
  },

  render() {
    const { $scopedSlots } = this;
    const children = this.children || $scopedSlots.default;
    return children(this.getLocale(), this.getLocaleCode());
  },
};
