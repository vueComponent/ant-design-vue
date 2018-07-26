
import PropTypes from '../_util/vue-types';

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string
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