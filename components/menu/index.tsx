import { defineComponent, inject, provide, toRef, App, ExtractPropTypes, Plugin } from 'vue';
import omit from 'omit.js';
import VcMenu, { Divider, ItemGroup } from '../vc-menu';
import SubMenu from './SubMenu';
import PropTypes from '../_util/vue-types';
import animation from '../_util/openAnimation';
import warning from '../_util/warning';
import Item from './MenuItem';
import { hasProp, getOptionProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import commonPropsType from '../vc-menu/commonPropsType';
import { defaultConfigProvider } from '../config-provider';
import { SiderContextProps } from '../layout/Sider';
import { tuple } from '../_util/type';
// import raf from '../_util/raf';

export const MenuMode = PropTypes.oneOf([
  'vertical',
  'vertical-left',
  'vertical-right',
  'horizontal',
  'inline',
]);

export const menuProps = {
  ...commonPropsType,
  theme: PropTypes.oneOf(tuple('light', 'dark')).def('light'),
  mode: MenuMode.def('vertical'),
  selectable: PropTypes.looseBool,
  selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  openKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  openTransitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  multiple: PropTypes.looseBool,
  inlineIndent: PropTypes.number.def(24),
  inlineCollapsed: PropTypes.looseBool,
  isRootMenu: PropTypes.looseBool.def(true),
  focusable: PropTypes.looseBool.def(false),
  onOpenChange: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onClick: PropTypes.func,
  onMouseenter: PropTypes.func,
  onSelectChange: PropTypes.func,
};

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

const Menu = defineComponent({
  name: 'AMenu',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: menuProps,
  Divider: { ...Divider, name: 'AMenuDivider' },
  Item: { ...Item, name: 'AMenuItem' },
  SubMenu: { ...SubMenu, name: 'ASubMenu' },
  ItemGroup: { ...ItemGroup, name: 'AMenuItemGroup' },
  emits: [
    'update:selectedKeys',
    'update:openKeys',
    'mouseenter',
    'openChange',
    'click',
    'selectChange',
    'select',
    'deselect',
  ],
  setup() {
    const layoutSiderContext = inject<SiderContextProps>('layoutSiderContext', {});
    const layoutSiderCollapsed = toRef(layoutSiderContext, 'sCollapsed');
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
      layoutSiderContext,
      layoutSiderCollapsed,
      propsUpdating: false,
      switchingModeFromInline: false,
      leaveAnimationExecutedWhenInlineCollapsed: false,
      inlineOpenKeys: [],
    };
  },
  data() {
    const props: MenuProps = getOptionProps(this);
    warning(
      !('inlineCollapsed' in props && props.mode !== 'inline'),
      'Menu',
      "`inlineCollapsed` should only be used when Menu's `mode` is inline.",
    );
    let sOpenKeys: (number | string)[];

    if ('openKeys' in props) {
      sOpenKeys = props.openKeys;
    } else if ('defaultOpenKeys' in props) {
      sOpenKeys = props.defaultOpenKeys;
    }
    return {
      sOpenKeys,
    };
  },
  // beforeUnmount() {
  //   raf.cancel(this.mountRafId);
  // },
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
    layoutSiderCollapsed(val) {
      this.collapsedChange(val);
    },
  },
  created() {
    provide('getInlineCollapsed', this.getInlineCollapsed);
    provide('menuPropsContext', this.$props);
  },
  updated() {
    this.propsUpdating = false;
  },
  methods: {
    collapsedChange(val: unknown) {
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
    handleMouseEnter(e: Event) {
      this.restoreModeVerticalFromInline();
      this.$emit('mouseenter', e);
    },
    handleTransitionEnd(e: TransitionEvent) {
      // when inlineCollapsed menu width animation finished
      // https://github.com/ant-design/ant-design/issues/12864
      const widthCollapsed = e.propertyName === 'width' && e.target === e.currentTarget;

      // Fix SVGElement e.target.className.indexOf is not a function
      // https://github.com/ant-design/ant-design/issues/15699
      const { className } = e.target as SVGAnimationElement | HTMLElement;
      // SVGAnimatedString.animVal should be identical to SVGAnimatedString.baseVal, unless during an animation.
      const classNameValue =
        Object.prototype.toString.call(className) === '[object SVGAnimatedString]'
          ? className.animVal
          : className;

      // Fix for <Menu style={{ width: '100%' }} />, the width transition won't trigger when menu is collapsed
      // https://github.com/ant-design/ant-design-pro/issues/2783
      const iconScaled = e.propertyName === 'font-size' && classNameValue.indexOf('anticon') >= 0;

      if (widthCollapsed || iconScaled) {
        this.restoreModeVerticalFromInline();
      }
    },
    handleClick(e: Event) {
      this.handleOpenChange([]);
      this.$emit('click', e);
    },
    handleSelect(info) {
      this.$emit('update:selectedKeys', info.selectedKeys);
      this.$emit('select', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleDeselect(info) {
      this.$emit('update:selectedKeys', info.selectedKeys);
      this.$emit('deselect', info);
      this.$emit('selectChange', info.selectedKeys);
    },
    handleOpenChange(openKeys: (number | string)[]) {
      this.setOpenKeys(openKeys);
      this.$emit('update:openKeys', openKeys);
      this.$emit('openChange', openKeys);
    },
    setOpenKeys(openKeys: (number | string)[]) {
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
    getMenuOpenAnimation(menuMode: string) {
      const { openAnimation, openTransitionName } = this.$props;
      let menuOpenAnimation = openAnimation || openTransitionName;
      if (openAnimation === undefined && openTransitionName === undefined) {
        if (menuMode === 'horizontal') {
          menuOpenAnimation = 'slide-up';
        } else if (menuMode === 'inline') {
          menuOpenAnimation = animation;
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
    const { layoutSiderContext } = this;
    const { collapsedWidth } = layoutSiderContext;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, theme, getPopupContainer } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('menu', customizePrefixCls);
    const menuMode = this.getRealMenuMode();
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode);
    const { class: className, ...otherAttrs } = this.$attrs;
    const menuClassName = {
      [className as string]: className,
      [`${prefixCls}-${theme}`]: true,
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed(),
    };

    const menuProps = {
      ...omit(props, [
        'inlineCollapsed',
        'onUpdate:selectedKeys',
        'onUpdate:openKeys',
        'onSelectChange',
      ]),
      getPopupContainer: getPopupContainer || getContextPopupContainer,
      openKeys: this.sOpenKeys,
      mode: menuMode,
      prefixCls,
      ...otherAttrs,
      onSelect: this.handleSelect,
      onDeselect: this.handleDeselect,
      onOpenChange: this.handleOpenChange,
      onMouseenter: this.handleMouseEnter,
      onTransitionend: this.handleTransitionEnd,
      // children: getSlot(this),
    };
    if (!hasProp(this, 'selectedKeys')) {
      delete menuProps.selectedKeys;
    }

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.onClick = this.handleClick;
      menuProps.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.onClick = (e: Event) => {
        this.$emit('click', e);
      };
      menuProps.openAnimation = menuOpenAnimation;
    }

    // https://github.com/ant-design/ant-design/issues/8587
    const hideMenu =
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 || collapsedWidth === '0' || collapsedWidth === '0px');
    if (hideMenu) {
      menuProps.openKeys = [];
    }

    return <VcMenu {...menuProps} class={menuClassName} v-slots={this.$slots} />;
  },
});

/* istanbul ignore next */
Menu.install = function(app: App) {
  app.component(Menu.name, Menu);
  app.component(Menu.Item.name, Menu.Item);
  app.component(Menu.SubMenu.name, Menu.SubMenu);
  app.component(Menu.Divider.name, Menu.Divider);
  app.component(Menu.ItemGroup.name, Menu.ItemGroup);
  return app;
};

export default Menu as typeof Menu &
  Plugin & {
    readonly Item: typeof Item;
    readonly SubMenu: typeof SubMenu;
    readonly Divider: typeof Divider;
    readonly ItemGroup: typeof ItemGroup;
  };
