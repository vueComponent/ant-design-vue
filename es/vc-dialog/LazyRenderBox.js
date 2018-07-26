
import PropTypes from '../_util/vue-types';

var ILazyRenderBoxPropTypes = {
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string
};

export default {
  props: ILazyRenderBoxPropTypes,
  render: function render() {
    var h = arguments[0];

    return h('div', [this.$slots['default']]);
  }
};