import PropTypes from '../_util/vue-types';

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render() {
    const { hiddenClassName, visible } = this.$props;
    let children = null;
    if (hiddenClassName || !this.$slots.default || this.$slots.default.length > 1) {
      const cls = '';
      if (!visible && hiddenClassName) {
        // cls += ` ${hiddenClassName}`
      }
      children = <div class={cls}>{this.$slots.default}</div>;
    } else {
      children = this.$slots.default[0];
    }
    return children;
  },
};
