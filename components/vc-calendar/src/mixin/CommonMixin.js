export default {
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
    getFormat() {
      let { format } = this;
      const { locale, timePicker } = this;
      if (!format) {
        if (timePicker) {
          format = locale.dateTimeFormat;
        } else {
          format = locale.dateFormat;
        }
      }
      return format;
    },
    focus() {
      if (this.focusElement) {
        this.focusElement.focus();
      } else if (this.$refs.rootInstance) {
        this.$refs.rootInstance.focus();
      }
    },
    saveFocusElement(focusElement) {
      this.focusElement = focusElement;
    },
  },
};
