import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
} from 'vue';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import KeyCode from '../_util/KeyCode';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import BaseMixin from '../_util/BaseMixin';
import { getComponent, splitAttrs, findDOMNode, getSlot } from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';
import { noop, getMenuIdFromSubMenuEventKey, loopMenuItemRecursively } from './util';
import { getTransitionProps, Transition } from '../_util/transition';
import InjectExtraProps from './InjectExtraProps';

let guid = 0;
const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

const updateDefaultActiveFirst = (store, eventKey, defaultActiveFirst) => {
  const menuId = getMenuIdFromSubMenuEventKey(eventKey);
  store.defaultActiveFirst[menuId] = defaultActiveFirst;
};
let indexGuid = 0;
const SubMenu = defineComponent({
  name: 'SubMenu',
  mixins: [BaseMixin],
  inheritAttrs: false,
  isSubMenu: true,
  props: {
    title: PropTypes.any,
    openKeys: PropTypes.array.def([]),
    openChange: PropTypes.func.def(noop),
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.looseBool,
    isRootMenu: PropTypes.looseBool.def(false),
    index: PropTypes.number,
    triggerSubMenuAction: PropTypes.string,
    popupClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    forceSubMenuRender: PropTypes.looseBool.def(false),
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.looseBool,
    subMenuOpenDelay: PropTypes.number.def(0.1),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    level: PropTypes.number.def(1),
    inlineIndent: PropTypes.number.def(24),
    openTransitionName: PropTypes.string,
    popupOffset: PropTypes.array,
    mode: PropTypes.oneOf([
      'horizontal',
      'vertical',
      'vertical-left',
      'vertical-right',
      'inline',
    ]).def('vertical'),
    manualRef: PropTypes.func.def(noop),
    builtinPlacements: PropTypes.object.def(() => ({})),
    itemIcon: PropTypes.any,
    expandIcon: PropTypes.any,
    subMenuKey: PropTypes.string,
    theme: PropTypes.string,
    parentUniKeys: PropTypes.array.def(() => []),
    parentUniKey: PropTypes.string,
    isOverflowedSubMenu: PropTypes.looseBool.def(false),
  },

  isSubMenu: true,
  setup(props) {
    const uniKey = props.isOverflowedSubMenu
      ? 'MENUITEM_OVERFLOWED_UNI_KEY'
      : `sub_menu_${++indexGuid}`;
    const store = inject('menuStore', () => ({}));
    onMounted(() => {
      store.addChildrenInfo(
        uniKey,
        computed(() => ({
          parentUniKeys: props.parentUniKeys,
          parentUniKey: props.parentUniKey,
          eventKey: props.eventKey,
          disabled: props.disabled,
        })),
      );
    });
    onBeforeUnmount(() => {
      store.removeChildrenInfo(uniKey);
    });
    const isChildrenSelected = computed(() => {
      return store.selectedParentUniKeys.indexOf(uniKey) !== -1;
    });
    const ins = getCurrentInstance();
    const getEl = () => {
      return ins.vnode.el;
    };
    provide(
      'parentMenu',
      reactive({
        isRootMenu: computed(() => props.isRootMenu),
        getPopupContainer: props.getPopupContainer,
        getEl,
      }),
    );
    return {
      parentMenu: inject('parentMenu', undefined),
      store,
      isChildrenSelected,
      childrenUniKeys: [...props.parentUniKeys, uniKey],
      uniKey,
      isOpen: computed(() => store.openKeys.indexOf(props.eventKey) > -1),
      active: computed(() => store.activeKey[props.subMenuKey] === props.eventKey),
    };
  },
  data() {
    const props = this.$props;
    const store = this.store;
    const eventKey = props.eventKey;
    const defaultActiveFirst = store.defaultActiveFirst;
    let value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);
    this.internalMenuId = undefined;
    this.haveRendered = undefined;
    this.haveOpened = undefined;
    this.subMenuTitle = undefined;
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.handleUpdated();
    });
  },

  updated() {
    this.$nextTick(() => {
      this.handleUpdated();
    });
  },

  beforeUnmount() {
    const { eventKey } = this;
    this.__emit('destroy', eventKey);

    /* istanbul ignore if */
    if (this.minWidthTimeout) {
      cancelAnimationTimeout(this.minWidthTimeout);
      this.minWidthTimeout = null;
    }

    /* istanbul ignore if */
    if (this.mouseenterTimeout) {
      cancelAnimationTimeout(this.mouseenterTimeout);
      this.mouseenterTimeout = null;
    }
  },
  methods: {
    isChildrenSelected2() {
      if (this.haveOpened) return this.isChildrenSelected;
      const ret = { find: false };
      loopMenuItemRecursively(getSlot(this), this.store.selectedKeys, ret);
      return ret.find;
    },
    handleUpdated() {
      const { mode, manualRef } = this.$props;
      // invoke customized ref to expose component to mixin
      if (manualRef) {
        manualRef(this);
      }
      if (mode !== 'horizontal' || !this.parentMenu.isRootMenu || !this.isOpen) {
        return;
      }
      this.minWidthTimeout = requestAnimationTimeout(() => this.adjustWidth(), 0);
    },

    onKeyDown(e) {
      const keyCode = e.keyCode;
      const menu = this.menuInstance;
      const { isOpen } = this;
      if (keyCode === KeyCode.ENTER) {
        this.onTitleClick(e);
        updateDefaultActiveFirst(this.store, this.$props.eventKey, true);
        return true;
      }
      if (keyCode === KeyCode.RIGHT) {
        if (isOpen) {
          menu.onKeyDown(e);
        } else {
          this.triggerOpenChange(true);
          // need to update current menu's defaultActiveFirst value
          updateDefaultActiveFirst(this.store, this.$props.eventKey, true);
        }
        return true;
      }
      if (keyCode === KeyCode.LEFT) {
        let handled;
        if (isOpen) {
          handled = menu.onKeyDown(e);
        } else {
          return undefined;
        }
        if (!handled) {
          this.triggerOpenChange(false);
          handled = true;
        }
        return handled;
      }

      if (isOpen && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
        return menu.onKeyDown(e);
      }
      return undefined;
    },

    onPopupVisibleChange(visible) {
      this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
    },

    onMouseEnter(e) {
      const { eventKey: key } = this.$props;
      updateDefaultActiveFirst(this.store, key, false);
      this.__emit('mouseenter', {
        key,
        domEvent: e,
      });
    },

    onMouseLeave(e) {
      const { eventKey } = this.$props;
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e,
      });
    },

    onTitleMouseEnter(domEvent) {
      const { eventKey: key } = this.$props;
      this.__emit('itemHover', {
        key,
        hover: true,
      });
      this.__emit('titleMouseenter', {
        key,
        domEvent,
      });
    },

    onTitleMouseLeave(e) {
      const { eventKey } = this.$props;
      this.__emit('itemHover', {
        key: eventKey,
        hover: false,
      });
      this.__emit('titleMouseleave', {
        key: eventKey,
        domEvent: e,
      });
    },

    onTitleClick(e) {
      const { triggerSubMenuAction, eventKey } = this.$props;
      this.__emit('titleClick', {
        key: eventKey,
        domEvent: e,
      });
      if (triggerSubMenuAction === 'hover') {
        return;
      }
      this.triggerOpenChange(!this.isOpen, 'click');
      updateDefaultActiveFirst(this.store, eventKey, false);
    },

    onSubMenuClick(info) {
      this.__emit('click', this.addKeyPath(info));
    },

    getPrefixCls() {
      return `${this.$props.rootPrefixCls}-submenu`;
    },

    getActiveClassName() {
      return `${this.getPrefixCls()}-active`;
    },

    getDisabledClassName() {
      return `${this.getPrefixCls()}-disabled`;
    },

    getSelectedClassName() {
      return `${this.getPrefixCls()}-selected`;
    },

    getOpenClassName() {
      return `${this.$props.rootPrefixCls}-submenu-open`;
    },

    saveMenuInstance(c) {
      // children menu instance
      this.menuInstance = c;
    },

    addKeyPath(info) {
      return {
        ...info,
        keyPath: (info.keyPath || []).concat(this.$props.eventKey),
      };
    },
    triggerOpenChange(open, type) {
      const key = this.$props.eventKey;
      const openChange = () => {
        this.__emit('openChange', {
          key,
          item: this.$props,
          trigger: type,
          open,
        });
      };
      if (type === 'mouseenter') {
        // make sure mouseenter happen after other menu item's mouseleave
        this.mouseenterTimeout = requestAnimationTimeout(() => {
          openChange();
        }, 0);
      } else {
        openChange();
      }
    },
    adjustWidth() {
      /* istanbul ignore if */
      if (!this.subMenuTitle || !this.menuInstance) {
        return;
      }
      const popupMenu = findDOMNode(this.menuInstance);
      if (popupMenu.offsetWidth >= this.subMenuTitle.offsetWidth) {
        return;
      }

      /* istanbul ignore next */
      popupMenu.style.minWidth = `${this.subMenuTitle.offsetWidth}px`;
    },
    saveSubMenuTitle(subMenuTitle) {
      this.subMenuTitle = subMenuTitle;
    },
    renderChildren() {
      const props = { ...this.$props, ...this.$attrs };

      const subPopupMenuProps = {
        mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
        visible: this.isOpen,
        level: props.level + 1,
        inlineIndent: props.inlineIndent,
        focusable: false,
        eventKey: `${props.eventKey}-menu-`,
        openKeys: props.openKeys,
        openTransitionName: props.openTransitionName,
        openAnimation: props.openAnimation,
        subMenuOpenDelay: props.subMenuOpenDelay,
        subMenuCloseDelay: props.subMenuCloseDelay,
        forceSubMenuRender: props.forceSubMenuRender,
        triggerSubMenuAction: props.triggerSubMenuAction,
        builtinPlacements: props.builtinPlacements,
        multiple: props.multiple,
        prefixCls: props.rootPrefixCls,
        manualRef: this.saveMenuInstance,
        itemIcon: getComponent(this, 'itemIcon'),
        expandIcon: getComponent(this, 'expandIcon'),
        onClick: this.onSubMenuClick,
        onSelect: props.onSelect || noop,
        onDeselect: props.onDeselect || noop,
        onOpenChange: props.onOpenChange || noop,
        id: this.internalMenuId,
        parentUniKeys: this.childrenUniKeys,
        parentUniKey: this.uniKey,
      };
      const haveRendered = this.haveRendered;
      this.haveRendered = true;

      this.haveOpened =
        this.haveOpened || subPopupMenuProps.visible || subPopupMenuProps.forceSubMenuRender;
      // never rendered not planning to, don't render
      if (!this.haveOpened) {
        return <div />;
      }

      // don't show transition on first rendering (no animation for opened menu)
      // show appear transition if it's not visible (not sure why)
      // show appear transition if it's not inline mode
      const transitionAppear =
        haveRendered || !subPopupMenuProps.visible || !subPopupMenuProps.mode === 'inline';
      subPopupMenuProps.class = ` ${subPopupMenuProps.prefixCls}-sub`;
      let transitionProps = { appear: transitionAppear, css: false };

      if (subPopupMenuProps.openTransitionName) {
        transitionProps = getTransitionProps(subPopupMenuProps.openTransitionName, {
          appear: transitionAppear,
        });
      } else if (typeof subPopupMenuProps.openAnimation === 'object') {
        transitionProps = { ...transitionProps, ...(subPopupMenuProps.openAnimation || {}) };
        if (!transitionAppear) {
          transitionProps.appear = false;
        }
      } else if (typeof subPopupMenuProps.openAnimation === 'string') {
        transitionProps = getTransitionProps(subPopupMenuProps.openAnimation, {
          appear: transitionAppear,
        });
      }
      return (
        <Transition {...transitionProps}>
          <SubPopupMenu v-show={this.isOpen} {...subPopupMenuProps} v-slots={this.$slots} />
        </Transition>
      );
    },
  },

  render() {
    const props = { ...this.$props, ...this.$attrs };
    const { onEvents } = splitAttrs(props);
    const isOpen = this.isOpen;
    const prefixCls = this.getPrefixCls();
    const isInlineMode = props.mode === 'inline';
    if (!this.internalMenuId) {
      if (props.eventKey) {
        this.internalMenuId = `${props.eventKey}$Menu`;
      } else {
        this.internalMenuId = `$__$${++guid}$Menu`;
      }
    }
    const children = this.renderChildren();
    const className = {
      [prefixCls]: true,
      [`${prefixCls}-${props.mode}`]: true,
      [props.class]: !!props.class,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: this.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected || this.isChildrenSelected2(),
    };
    let mouseEvents = {};
    let titleClickEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        onMouseleave: this.onMouseLeave,
        onMouseenter: this.onMouseEnter,
      };

      // only works in title, not outer li
      titleClickEvents = {
        onClick: this.onTitleClick,
      };
      titleMouseEvents = {
        onMouseenter: this.onTitleMouseEnter,
        onMouseleave: this.onTitleMouseLeave,
      };
    }

    const style = {};
    if (isInlineMode) {
      style.paddingLeft = `${props.inlineIndent * props.level}px`;
    }
    let ariaOwns = {};
    // only set aria-owns when menu is open
    // otherwise it would be an invalid aria-owns value
    // since corresponding node cannot be found
    if (isOpen) {
      ariaOwns = {
        'aria-owns': this.internalMenuId,
      };
    }
    const titleProps = {
      'aria-expanded': isOpen,
      ...ariaOwns,
      'aria-haspopup': 'true',
      title: typeof props.title === 'string' ? props.title : undefined,
      ...titleMouseEvents,
      ...titleClickEvents,
      style,
      class: `${prefixCls}-title`,
      ref: this.saveSubMenuTitle,
    };

    // expand custom icon should NOT be displayed in menu with horizontal mode.
    let icon = null;
    if (props.mode !== 'horizontal') {
      icon = getComponent(this, 'expandIcon', props);
    }
    const title = (
      <div {...titleProps}>
        {getComponent(this, 'title')}
        {icon || <i class={`${prefixCls}-arrow`} />}
      </div>
    );
    const getPopupContainer = this.parentMenu.isRootMenu
      ? this.parentMenu.getPopupContainer
      : triggerNode => triggerNode.parentNode;
    const popupPlacement = popupPlacementMap[props.mode];
    const popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    let popupClassName = props.mode === 'inline' ? '' : props.popupClassName || '';
    popupClassName = `${prefixCls}-popup ${popupClassName}`;
    const liProps = {
      ...omit(onEvents, ['onClick']),
      ...mouseEvents,
      class: className,
      style: props.style,
    };

    return (
      <li {...liProps} role="menuitem">
        {isInlineMode && title}
        {isInlineMode && children}
        {!isInlineMode && (
          <Trigger
            prefixCls={prefixCls}
            popupClassName={popupClassName}
            getPopupContainer={getPopupContainer}
            builtinPlacements={placements}
            builtinPlacements={Object.assign({}, placements, props.builtinPlacements)}
            popupPlacement={popupPlacement}
            popupVisible={isOpen}
            popupAlign={popupAlign}
            action={props.disabled ? [] : [props.triggerSubMenuAction]}
            mouseEnterDelay={props.subMenuOpenDelay}
            mouseLeaveDelay={props.subMenuCloseDelay}
            onPopupVisibleChange={this.onPopupVisibleChange}
            forceRender={props.forceSubMenuRender}
            // popupTransitionName='rc-menu-open-slide-up'
            // popupAnimation={transitionProps}
            popup={children}
          >
            {title}
          </Trigger>
        )}
      </li>
    );
  },
});

export default InjectExtraProps(SubMenu);
