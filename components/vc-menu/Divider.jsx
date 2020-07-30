export default {
  name: 'MenuDivider',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    rootPrefixCls: String,
  },
  render() {
    const { rootPrefixCls } = this.$props;
    const { class: className = '', style } = this.$attrs;
    return <li class={`${className} ${rootPrefixCls}-item-divider`} style={style} />;
  },
};
