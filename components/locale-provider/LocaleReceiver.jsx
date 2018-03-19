
import PropTypes from '../_util/vue-types'

export default {
  props: {
    componentName: PropTypes.string,
    defaultLocale: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
    children: PropTypes.func,
  },
  inject: {
    localeData: { default: {}},
  },
  methods: {
    getLocale () {
      const { componentName, defaultLocale } = this
      const { antLocale } = this.localeData
      const localeFromContext = antLocale && antLocale[componentName]
      return {
        ...(typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale),
        ...(localeFromContext || {}),
      }
    },

    getLocaleCode () {
      const { antLocale } = this.localeData
      const localeCode = antLocale && antLocale.locale
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return 'en-us'
      }
      return localeCode
    },
  },

  render () {
    const { $scopedSlots } = this
    const children = this.children || $scopedSlots.default
    return children(this.getLocale(), this.getLocaleCode())
  },
}

