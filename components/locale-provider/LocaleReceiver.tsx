import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import defaultLocaleData from './default';

export default {
  name: 'LocaleReceiver',
  props: {
    componentName: PropTypes.string.def('global'),
    defaultLocale: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    children: PropTypes.func,
  },
  setup() {
    return {
      localeData: inject('localeData', {}),
    };
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
    const { $slots } = this;
    const children = this.children || $slots.default;
    const { antLocale } = this.localeData;
    return children?.(this.getLocale(), this.getLocaleCode(), antLocale);
  },
};
