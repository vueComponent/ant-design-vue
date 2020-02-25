import omit from 'omit.js';
import VcMenu, { Divider, ItemGroup, SubMenu } from '../vc-menu';
import PropTypes from '../_util/vue-types';
import animation from '../_util/openAnimation';
import warning from '../_util/warning';
import Item from './MenuItem';
import { hasProp, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import commonPropsType from '../vc-menu/commonPropsType';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

export const MenuMode = PropTypes.oneOf([
  'vertical',
  'vertical-left',
  'vertical-right',
  'horizontal',
  'inline',
]);

export const menuProps = {
  ...commonPropsType,
  theme: PropTypes.oneOf(['light', 'dark']).def('light'),
  mode: MenuMode.def('vertical'),
  selectable: PropTypes.bool,
  selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  defaultSelectedKeys: PropTypes.array,
  openKeys: PropTypes.array,
  defaultOpenKeys: PropTypes.array,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  openTransitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  multiple: PropTypes.bool,
  inlineIndent: PropTypes.number.def(24),
  inlineCollapsed: PropTypes.bool,
  isRootMenu: PropTypes.bool.def(true),
  focusable: PropTypes.bool.def(false),
};

const Menu = {
  name: 'AMenu',
  props: menuProps,
  Divider: { ...Divider, name: 'AMenuDivider' },
  Item: { ...Item, name: 'AMenuItem' },
  SubMenu: { ...SubMenu, name: 'ASubMenu' },
  ItemGroup: { ...ItemGroup, name: 'AMenuItemGroup' },
  provide() {
    return {
      getInlineCollapsed: this.getInlineCollapsed,
    };
  },
  mixins: [BaseMixin],
  inject: {
    layoutSiderContext: { default: () => ({}) },
    configProvider: { default: () => ConfigConsumerProps },
  },
  model: {
    prop: 'selectedKeys',
    event: 'selectChange',
  },
  created() {
    this.preProps = { ...this.$props };
  },
  updated() {
    this.propsUpdating = false;
  },
  watch: {
    mode(val, oldVal) {
      if (oldVal === 'inline' && val !== 'inline') {
        this.switchingModeFromInline = true;
      }
    },
    openKeys(val) {
      this.setState({ sOpenKeys: val });
    },
    inlineCollapsed(val) {
      this.collapsedChange(val);
    },
    'layoutSiderContext.sCollapsed': function(val) {
      this.collapsedChange(val);
    },
  },
  data() {
    const props = this.$props;
    warning(
      !(hasProp(this, 'inlineCollapsed') && props.mode !== 'inline'),
      "`inlineCollapsed` should only be used when Menu's `mode` is inline.",
    );
    this.switchingModeFromInline = false;
    this.leaveAnimationExecutedWhenInlineCollapsed = false;
    this.inlineOpenKeys = [];
    let sOpenKeys;

    if (hasProp(this, 'openKeys')) {
      sOpenKeys = props.openKeys;
    } else if (hasProp(this, 'defaultOpenKeys')) {
      sOpenKeys = props.defaultOpenKeys;
    }
    return {
      sOpenKeys,
    };
  },
  methods: {
    collapsedChange(val) {
      if (this.propsUpdating) {
        return;
      }
      this.propsUpdating = true;
      if (!hasProp(this, 'openKeys')) {
        if (val) {
          this.switchingModeFromInline = true;
          this.inlineOpenKeys = this.sOpenKeys;
          this.setState({ sOpenKeys: [] });
        } else {
          this.setState({ sOpenKeys: this.inlineOpenKeys });
          this.inlineOpenKeys = [];
        }
      } else if (val) {
        // 缩起时，openKeys置为空的动画会闪动，react可以通过是否传递openKeys避免闪动，vue不是很方便动态传递openKeys
        this.switchingModeFromInline = true;
      }
    },
    restoreModeVerticalFromInline() {
      if (this.switchingModeFromInline) {
        this.switchingModeFromInline = false;
        this.$forceUpdate();
      }
    },
    // Restore vertical mode when menu is collapsed responsively when mounted
    // https://github.com/ant-design/ant-design/issues/13104
    // TODO: not a perfect solution, looking a new way to avoid setting switchingModeFromInline in this situation
    handleMouseEnter(e) {
      this.restoreModeVerticalFromInline();
      this.$emit('mouseenter', e);
    },
    handleTransitionEnd(e) {
      // when inlineCollapsed menu width animation finished
      // https://github.com/ant-design/ant-design/issues/12864
      const widthCollapsed = e.propertyName === 'width' && e.target === e.currentTarget;
      // Fix for <Menu style={{ width: '100%' }} />, the width transition won't trigger when menu is collapsed
      // https://github.com/ant-design/ant-design-pro/issues/2783
      const iconScaled =
        e.propertyName === 'font-size' && e.target.className.indexOf('anticon') >= 0;
      if (widthCollapsed || iconScaled) {
        this.restoreModeVerticalFromInline();
      }
    },
    handleClick(e) {
      this.handleOpenChange([]);
      this.$emit('click', e);
    },
    handleSelect(info) {
      this.$emit('select', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleDeselect(info) {
      this.$emit('deselect', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleOpenChange(openKeys) {
      this.setOpenKeys(openKeys);
      this.$emit('openChange', openKeys);
      this.$emit('update:openKeys', openKeys);
    },
    setOpenKeys(openKeys) {
      if (!hasProp(this, 'openKeys')) {
        this.setState({ sOpenKeys: openKeys });
      }
    },
    getRealMenuMode() {
      const inlineCollapsed = this.getInlineCollapsed();
      if (this.switchingModeFromInline && inlineCollapsed) {
        return 'inline';
      }
      const { mode } = this.$props;
      return inlineCollapsed ? 'vertical' : mode;
    },
    getInlineCollapsed() {
      const { inlineCollapsed } = this.$props;
      if (this.layoutSiderContext.sCollapsed !== undefined) {
        return this.layoutSiderContext.sCollapsed;
      }
      return inlineCollapsed;
    },
    getMenuOpenAnimation(menuMode) {
      const { openAnimation, openTransitionName } = this.$props;
      let menuOpenAnimation = openAnimation || openTransitionName;
      if (openAnimation === undefined && openTransitionName === undefined) {
        if (menuMode === 'horizontal') {
          menuOpenAnimation = 'slide-up';
        } else if (menuMode === 'inline') {
          menuOpenAnimation = { on: animation };
        } else {
          // When mode switch from inline
          // submenu should hide without animation
          if (this.switchingModeFromInline) {
            menuOpenAnimation = '';
            this.switchingModeFromInline = false;
          } else {
            menuOpenAnimation = 'zoom-big';
          }
        }
      }
      return menuOpenAnimation;
    },
  },
  render() {
    const { layoutSiderContext, $slots } = this;
    const { collapsedWidth } = layoutSiderContext;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const { prefixCls: customizePrefixCls, theme, getPopupContainer } = this.$props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('menu', customizePrefixCls);
    const menuMode = this.getRealMenuMode();
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode);

    const menuClassName = {
      [`${prefixCls}-${theme}`]: true,
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
    };

    const menuProps = {
      props: {
        ...omit(this.$props, ['inlineCollapsed']),
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        openKeys: this.sOpenKeys,
        mode: menuMode,
        prefixCls,
      },
      on: {
        ...getListeners(this),
        select: this.handleSelect,
        deselect: this.handleDeselect,
        openChange: this.handleOpenChange,
        onMouseenter: this.handleMouseEnter,
      },
      nativeOn: {
        transitionend: this.handleTransitionEnd,
      },
    };
    if (!hasProp(this, 'selectedKeys')) {
      delete menuProps.props.selectedKeys;
    }

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.on.click = this.handleClick;
      menuProps.props.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.on.click = e => {
        this.$emit('click', e);
      };
      menuProps.props.openAnimation = menuOpenAnimation;
    }

    // https://github.com/ant-design/ant-design/issues/8587
    if (
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px')
    ) {
      return null;
    }

    return (
      <VcMenu {...menuProps} class={menuClassName}>
        {$slots.default}
      </VcMenu>
    );
  },
};

/* istanbul ignore next */
Menu.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Menu.name, Menu);
  Vue.component(Menu.Item.name, Menu.Item);
  Vue.component(Menu.SubMenu.name, Menu.SubMenu);
  Vue.component(Menu.Divider.name, Menu.Divider);
  Vue.component(Menu.ItemGroup.name, Menu.ItemGroup);
};
export default Menu;
