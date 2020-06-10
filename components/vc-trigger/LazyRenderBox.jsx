import PropTypes from '../_util/vue-types';

export default {
  name: 'LazyRenderBox',
  inheritAttrs: false,
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render() {
    const { hiddenClassName } = this.$props;
    const child = this.$slots.default && this.$slots.default();
    if (hiddenClassName || (child && child.length > 1)) {
      // const cls = '';
      // if (!visible && hiddenClassName) {
      //   // cls += ` ${hiddenClassName}`
      // }
      return <div {...this.$attrs}>{child}</div>;
    }
    return child && child[0];
  },
};
