import PropTypes from '../_util/vue-types';

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render() {
    const { hiddenClassName, visible } = this.$props;
    let children = null;
    if (hiddenClassName || !this.$scopedSlots.default || this.$scopedSlots.default().length > 1) {
      const cls = '';
      if (!visible && hiddenClassName) {
        // cls += ` ${hiddenClassName}`
      }
      children = <div class={cls}>{this.$scopedSlots.default()}</div>;
    } else {
      children = this.$scopedSlots.default()[0];
    }
    return children;
  },
};
