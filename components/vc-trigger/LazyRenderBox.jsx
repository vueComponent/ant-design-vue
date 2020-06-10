import PropTypes from '../_util/vue-types';

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render() {
    const { hiddenClassName, visible } = this.$props;
    const child = this.$slots.default && this.$slots.default();
    if (hiddenClassName || (child && child.length > 1)) {
      const cls = '';
      if (!visible && hiddenClassName) {
        // cls += ` ${hiddenClassName}`
      }
      return <div class={cls}>{child}</div>;
    }
    return child;
  },
};
