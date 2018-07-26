"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
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
    getFormat: function getFormat() {
      var format = this.format;
      var locale = this.locale,
          timePicker = this.timePicker;

      if (!format) {
        if (timePicker) {
          format = locale.dateTimeFormat;
        } else {
          format = locale.dateFormat;
        }
      }
      return format;
    },
    focus: function focus() {
      if (this.$refs.rootInstance) {
        this.$refs.rootInstance.focus();
      }
    }
  }

};
module.exports = exports["default"];