import { Transition, inject, provide } from 'vue';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import KeyCode from '../_util/KeyCode';
import { connect } from '../_util/store';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import BaseMixin from '../_util/BaseMixin';
import { getComponent, filterEmpty, getSlot, splitAttrs, findDOMNode } from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';
import { noop, loopMenuItemRecursively, getMenuIdFromSubMenuEventKey } from './util';
import getTransitionProps from '../_util/getTransitionProps';

let guid = 0;

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

const updateDefaultActiveFirst = (store, eventKey, defaultActiveFirst) => {
  const menuId = getMenuIdFromSubMenuEventKey(eventKey);
  const state = store.getState();
  store.setState({
    defaultActiveFirst: {
      ...state.defaultActiveFirst,
      [menuId]: defaultActiveFirst,
    },
  });
};

const SubMenu = {
  name: 'SubMenu',
  inheritAttrs: false,
  props: {
    title: PropTypes.any,
    selectedKeys: PropTypes.array.def([]),
    openKeys: PropTypes.array.def([]),
    openChange: PropTypes.func.def(noop),
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    isRootMenu: PropTypes.bool.def(false),
    index: PropTypes.number,
    triggerSubMenuAction: PropTypes.string,
    popupClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    forceSubMenuRender: PropTypes.bool,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    subMenuOpenDelay: PropTypes.number.def(0.1),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    level: PropTypes.number.def(1),
    inlineIndent: PropTypes.number.def(24),
    openTransitionName: PropTypes.string,
    popupOffset: PropTypes.array,
    isOpen: PropTypes.bool,
    store: PropTypes.object,
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
  },
  mixins: [BaseMixin],
  isSubMenu: true,
  setup() {
    return { parentMenu: inject('parentMenu', undefined) };
  },
  created() {
    provide('parentMenu', this);
  },
  data() {
    const props = this.$props;
    const store = props.store;
    const eventKey = props.eventKey;
    const defaultActiveFirst = store.getState().defaultActiveFirst;
    let value = false;

    if (defaultActiveFirst) {
      value = defaultActiveFirst[eventKey];
    }

    updateDefaultActiveFirst(store, eventKey, value);
    this.internalMenuId = undefined;
    this.haveRendered = undefined;
    this.haveOpened = undefined;
    this.subMenuTitle = undefined;
    return {
      // defaultActiveFirst: false,
    };
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
    handleUpdated() {
      const { mode, parentMenu, manualRef } = this;

      // invoke customized ref to expose component to mixin
      if (manualRef) {
        manualRef(this);
      }

      if (mode !== 'horizontal' || !parentMenu.isRootMenu || !this.isOpen) {
        return;
      }

      this.minWidthTimeout = requestAnimationTimeout(() => this.adjustWidth(), 0);
    },

    onKeyDown(e) {
      const keyCode = e.keyCode;
      const menu = this.menuInstance;
      const { store, isOpen } = this.$props;

      if (keyCode === KeyCode.ENTER) {
        this.onTitleClick(e);
        updateDefaultActiveFirst(store, this.eventKey, true);
        return true;
      }

      if (keyCode === KeyCode.RIGHT) {
        if (isOpen) {
          menu.onKeyDown(e);
        } else {
          this.triggerOpenChange(true);
          // need to update current menu's defaultActiveFirst value
          updateDefaultActiveFirst(store, this.eventKey, true);
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
      const { eventKey: key, store } = this.$props;
      updateDefaultActiveFirst(store, key, false);
      this.__emit('mouseenter', {
        key,
        domEvent: e,
      });
    },

    onMouseLeave(e) {
      const { eventKey } = this;
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
      const { eventKey } = this;
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
      const { triggerSubMenuAction, eventKey, isOpen, store } = this.$props;
      this.__emit('titleClick', {
        key: eventKey,
        domEvent: e,
      });
      if (triggerSubMenuAction === 'hover') {
        return;
      }
      this.triggerOpenChange(!isOpen, 'click');
      updateDefaultActiveFirst(store, eventKey, false);
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

    // triggerOpenChange (open, type) {
    //   const key = this.$props.eventKey
    //   this.__emit('openChange', {
    //     key,
    //     item: this,
    //     trigger: type,
    //     open,
    //   })
    // },
    triggerOpenChange(open, type) {
      const key = this.$props.eventKey;
      const openChange = () => {
        this.__emit('openChange', {
          key,
          item: this,
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

    isChildrenSelected() {
      const ret = { find: false };
      loopMenuItemRecursively(getSlot(this), this.$props.selectedKeys, ret);
      return ret.find;
    },
    // isOpen () {
    //   return this.$props.openKeys.indexOf(this.$props.eventKey) !== -1
    // },

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
    renderChildren(children) {
      const props = { ...this.$props, ...this.$attrs };
      const subPopupMenuProps = {
        mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
        visible: props.isOpen,
        level: props.level + 1,
        inlineIndent: props.inlineIndent,
        focusable: false,
        selectedKeys: props.selectedKeys,
        eventKey: `${props.eventKey}-menu-`,
        openKeys: props.openKeys,
        openTransitionName: props.openTransitionName,
        openAnimation: props.openAnimation,
        subMenuOpenDelay: props.subMenuOpenDelay,
        subMenuCloseDelay: props.subMenuCloseDelay,
        forceSubMenuRender: props.forceSubMenuRender,
        triggerSubMenuAction: props.triggerSubMenuAction,
        builtinPlacements: props.builtinPlacements,
        defaultActiveFirst: props.store.getState().defaultActiveFirst[
          getMenuIdFromSubMenuEventKey(props.eventKey)
        ],
        multiple: props.multiple,
        prefixCls: props.rootPrefixCls,
        manualRef: this.saveMenuInstance,
        itemIcon: getComponent(this, 'itemIcon'),
        expandIcon: getComponent(this, 'expandIcon'),
        children,
        onClick: this.onSubMenuClick,
        onSelect: props.onSelect || noop,
        onDeselect: props.onDeselect || noop,
        onOpenChange: props.onOpenChange || noop,
        id: this.internalMenuId,
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
          <SubPopupMenu v-show={props.isOpen} {...subPopupMenuProps} />
        </Transition>
      );
    },
  },

  render() {
    const props = { ...this.$props, ...this.$attrs };
    const { onEvents } = splitAttrs(props);
    const { rootPrefixCls, parentMenu } = this;
    const isOpen = props.isOpen;
    const prefixCls = this.getPrefixCls();
    const isInlineMode = props.mode === 'inline';
    const className = {
      [prefixCls]: true,
      [`${prefixCls}-${props.mode}`]: true,
      [props.class]: !!props.class,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: props.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    };

    if (!this.internalMenuId) {
      if (props.eventKey) {
        this.internalMenuId = `${props.eventKey}$Menu`;
      } else {
        this.internalMenuId = `$__$${++guid}$Menu`;
      }
    }

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
    const children = this.renderChildren(filterEmpty(getSlot(this)));

    const getPopupContainer = this.parentMenu.isRootMenu
      ? this.parentMenu.getPopupContainer
      : triggerNode => triggerNode.parentNode;
    const popupPlacement = popupPlacementMap[props.mode];
    const popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    let popupClassName = props.mode === 'inline' ? '' : props.popupClassName || '';
    popupClassName = `${prefixCls}-popup ${rootPrefixCls}-${parentMenu.theme} ${popupClassName}`;
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
};

const connected = connect(({ openKeys, activeKey, selectedKeys }, { eventKey, subMenuKey }) => {
  return {
    isOpen: openKeys.indexOf(eventKey) > -1,
    active: activeKey[subMenuKey] === eventKey,
    selectedKeys,
  };
})(SubMenu);

connected.isSubMenu = true;

export default connected;
