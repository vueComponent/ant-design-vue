import { SubMenu as VcSubMenu } from '../vc-menu';
import { getListeners } from '../_util/props-util';
import classNames from 'classnames';

export default {
  name: 'ASubMenu',
  isSubMenu: true,
  props: { ...VcSubMenu.props },
  inject: {
    menuPropsContext: { default: () => ({}) },
  },
  methods: {
    onKeyDown(e) {
      this.$refs.subMenu.onKeyDown(e);
    },
  },

  render() {
    const { $slots, $scopedSlots } = this;
    const { rootPrefixCls, popupClassName } = this.$props;
    const { theme: antdMenuTheme } = this.menuPropsContext;
    const props = {
      props: {
        ...this.$props,
        popupClassName: classNames(`${rootPrefixCls}-${antdMenuTheme}`, popupClassName),
      },
      ref: 'subMenu',
      on: getListeners(this),
      scopedSlots: $scopedSlots,
    };
    const slotsKey = Object.keys($slots);
    return (
      <VcSubMenu {...props}>
        {slotsKey.length
          ? slotsKey.map(name => {
              return <template slot={name}>{$slots[name]}</template>;
            })
          : null}
      </VcSubMenu>
    );
  },
};
