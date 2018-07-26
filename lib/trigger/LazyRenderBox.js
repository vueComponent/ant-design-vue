'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  props: {
    visible: _vueTypes2['default'].bool,
    hiddenClassName: _vueTypes2['default'].string
  },
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        hiddenClassName = _$props.hiddenClassName,
        visible = _$props.visible;


    if (hiddenClassName || !this.$slots['default'] || this.$slots['default'].length > 1) {
      var cls = '';
      if (!visible && hiddenClassName) {
        cls += ' ' + hiddenClassName;
      }
      return h(
        'div',
        { 'class': cls },
        [this.$slots['default']]
      );
    }

    return this.$slots['default'][0];
  }
};
module.exports = exports['default'];