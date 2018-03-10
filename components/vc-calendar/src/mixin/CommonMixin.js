import PropTypes from '@/components/_util/vue-types'
import enUs from '../locale/en_US'

export default {
  props: {
    locale: PropTypes.object.def(enUs),
    visible: PropTypes.bool.def(true),
    // onSelect: PropTypes.func,
    prefixCls: PropTypes.string.def('rc-calendat'),
    // onChange: PropTypes.func,
    // onOk: PropTypes.func,
  },

  // getDefaultProps () {
  //   return {
  //     locale: enUs,
  //     visible: true,
  //     prefixCls: 'rc-calendar',

  //     renderFooter () {
  //       return null
  //     },
  //     renderSidebar () {
  //       return null
  //     },
  //   }
  // },

  // shouldComponentUpdate (nextProps) {
  //   return this.props.visible || nextProps.visible
  // },
  methods: {
    getFormat () {
      let { format } = this
      const { locale, timePicker } = this
      if (!format) {
        if (timePicker) {
          format = locale.dateTimeFormat
        } else {
          format = locale.dateFormat
        }
      }
      return format
    },

    focus () {
      if (this.$refs.rootInstance) {
        this.$refs.rootInstance.focus()
      }
    },
  },

}
