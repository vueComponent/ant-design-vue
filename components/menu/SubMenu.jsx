import { inject } from 'vue';
import { SubMenu as VcSubMenu } from '../vc-menu';
import classNames from '../_util/classNames';
import Omit from 'omit.js';
import { getSlot } from '../_util/props-util';

export default {
  name: 'ASubMenu',
  isSubMenu: true,
  inheritAttrs: false,
  props: { ...VcSubMenu.props },
  setup() {
    return {
      menuPropsContext: inject('menuPropsContext', {}),
    };
  },
  methods: {
    onKeyDown(e) {
      this.$refs.subMenu.onKeyDown(e);
    },
  },

  render() {
    const { $slots, $attrs } = this;
    const { rootPrefixCls, popupClassName } = this.$props;
    const { theme: antdMenuTheme } = this.menuPropsContext;
    const props = {
      ...this.$props,
      popupClassName: classNames(`${rootPrefixCls}-${antdMenuTheme}`, popupClassName),
      ref: 'subMenu',
      ...$attrs,
      ...Omit($slots, ['default']),
    };
    return <VcSubMenu {...props}>{getSlot(this)}</VcSubMenu>;
  },
};
