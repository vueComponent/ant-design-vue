<script>
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
    antLocale: { default: {}},
  },
  methods: {
    getLocale () {
      const { componentName, defaultLocale } = this
      const { antLocale } = this
      const localeFromContext = antLocale && antLocale[componentName]
      return {
        ...(typeof defaultLocale === 'function' ? defaultLocale() : defaultLocale),
        ...(localeFromContext || {}),
      }
    },

    getLocaleCode () {
      const { antLocale } = this
      const localeCode = antLocale && antLocale.locale
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return 'en-us'
      }
      return localeCode
    },
  },

  render () {
    return this.children(this.getLocale(), this.getLocaleCode())
  },
}

</script>
