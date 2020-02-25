import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import Trigger from '../vc-trigger';
import KeyCode from '../_util/KeyCode';
import { connect } from '../_util/store';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import BaseMixin from '../_util/BaseMixin';
import { getComponentFromProp, filterEmpty, getListeners } from '../_util/props-util';
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
  props: {
    parentMenu: PropTypes.object,
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
    builtinPlacements: PropTypes.object.def({}),
    itemIcon: PropTypes.any,
    expandIcon: PropTypes.any,
  },
  mixins: [BaseMixin],
  isSubMenu: true,
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

  beforeDestroy() {
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
      const { mode, parentMenu, manualRef } = this.$props;

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
      const { eventKey, parentMenu } = this;
      parentMenu.subMenuInstance = this;
      // parentMenu.subMenuLeaveFn = () => {
      // // trigger mouseleave
      //   this.__emit('mouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e,
      });
      // prevent popup menu and submenu gap
      // parentMenu.subMenuLeaveTimer = setTimeout(parentMenu.subMenuLeaveFn, 100)
    },

    onTitleMouseEnter(domEvent) {
      const { eventKey: key } = this.$props;
      // this.clearSubMenuTitleLeaveTimer()
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
      const { eventKey, parentMenu } = this;
      parentMenu.subMenuInstance = this;
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
      loopMenuItemRecursively(this.$slots.default, this.$props.selectedKeys, ret);
      return ret.find;
    },
    // isOpen () {
    //   return this.$props.openKeys.indexOf(this.$props.eventKey) !== -1
    // },

    adjustWidth() {
      /* istanbul ignore if */
      if (!this.$refs.subMenuTitle || !this.menuInstance) {
        return;
      }
      const popupMenu = this.menuInstance.$el;
      if (popupMenu.offsetWidth >= this.$refs.subMenuTitle.offsetWidth) {
        return;
      }

      /* istanbul ignore next */
      popupMenu.style.minWidth = `${this.$refs.subMenuTitle.offsetWidth}px`;
    },

    renderChildren(children) {
      const props = this.$props;
      const { select, deselect, openChange } = getListeners(this);
      const subPopupMenuProps = {
        props: {
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
          parentMenu: this,
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
          itemIcon: getComponentFromProp(this, 'itemIcon'),
          expandIcon: getComponentFromProp(this, 'expandIcon'),
          children,
        },
        on: {
          click: this.onSubMenuClick,
          select,
          deselect,
          openChange,
        },
        id: this._menuId,
      };
      const baseProps = subPopupMenuProps.props;
      const haveRendered = this.haveRendered;
      this.haveRendered = true;

      this.haveOpened = this.haveOpened || baseProps.visible || baseProps.forceSubMenuRender;
      // never rendered not planning to, don't render
      if (!this.haveOpened) {
        return <div />;
      }

      // don't show transition on first rendering (no animation for opened menu)
      // show appear transition if it's not visible (not sure why)
      // show appear transition if it's not inline mode
      const transitionAppear = haveRendered || !baseProps.visible || !baseProps.mode === 'inline';
      subPopupMenuProps.class = ` ${baseProps.prefixCls}-sub`;
      let animProps = { appear: transitionAppear, css: false };
      let transitionProps = {
        props: animProps,
        on: {},
      };
      if (baseProps.openTransitionName) {
        transitionProps = getTransitionProps(baseProps.openTransitionName, {
          appear: transitionAppear,
        });
      } else if (typeof baseProps.openAnimation === 'object') {
        animProps = { ...animProps, ...(baseProps.openAnimation.props || {}) };
        if (!transitionAppear) {
          animProps.appear = false;
        }
      } else if (typeof baseProps.openAnimation === 'string') {
        transitionProps = getTransitionProps(baseProps.openAnimation, { appear: transitionAppear });
      }

      if (typeof baseProps.openAnimation === 'object' && baseProps.openAnimation.on) {
        transitionProps.on = baseProps.openAnimation.on;
      }
      return (
        <transition {...transitionProps}>
          <SubPopupMenu v-show={props.isOpen} {...subPopupMenuProps} />
        </transition>
      );
    },
  },

  render() {
    const props = this.$props;
    const { rootPrefixCls, parentMenu } = this;
    const isOpen = props.isOpen;
    const prefixCls = this.getPrefixCls();
    const isInlineMode = props.mode === 'inline';
    const className = {
      [prefixCls]: true,
      [`${prefixCls}-${props.mode}`]: true,
      [this.getOpenClassName()]: isOpen,
      [this.getActiveClassName()]: props.active || (isOpen && !isInlineMode),
      [this.getDisabledClassName()]: props.disabled,
      [this.getSelectedClassName()]: this.isChildrenSelected(),
    };

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = `${props.eventKey}$Menu`;
      } else {
        this._menuId = `$__$${++guid}$Menu`;
      }
    }

    let mouseEvents = {};
    let titleClickEvents = {};
    let titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter,
      };

      // only works in title, not outer li
      titleClickEvents = {
        click: this.onTitleClick,
      };
      titleMouseEvents = {
        mouseenter: this.onTitleMouseEnter,
        mouseleave: this.onTitleMouseLeave,
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
        'aria-owns': this._menuId,
      };
    }
    const titleProps = {
      attrs: {
        'aria-expanded': isOpen,
        ...ariaOwns,
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined,
      },
      on: {
        ...titleMouseEvents,
        ...titleClickEvents,
      },
      style,
      class: `${prefixCls}-title`,
      ref: 'subMenuTitle',
    };
    // expand custom icon should NOT be displayed in menu with horizontal mode.
    let icon = null;
    if (props.mode !== 'horizontal') {
      icon = getComponentFromProp(this, 'expandIcon', props);
    }
    const title = (
      <div {...titleProps}>
        {getComponentFromProp(this, 'title')}
        {icon || <i class={`${prefixCls}-arrow`} />}
      </div>
    );
    const children = this.renderChildren(filterEmpty(this.$slots.default));

    const getPopupContainer = this.parentMenu.isRootMenu
      ? this.parentMenu.getPopupContainer
      : triggerNode => triggerNode.parentNode;
    const popupPlacement = popupPlacementMap[props.mode];
    const popupAlign = props.popupOffset ? { offset: props.popupOffset } : {};
    const popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    const liProps = {
      on: { ...omit(getListeners(this), ['click']), ...mouseEvents },
      class: className,
    };

    return (
      <li {...liProps} role="menuitem">
        {isInlineMode && title}
        {isInlineMode && children}
        {!isInlineMode && (
          <Trigger
            prefixCls={prefixCls}
            popupClassName={`${prefixCls}-popup ${rootPrefixCls}-${
              parentMenu.theme
            } ${popupClassName || ''}`}
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
          >
            <template slot="popup">{children}</template>
            {title}
          </Trigger>
        )}
      </li>
    );
  },
};

const connected = connect(({ openKeys, activeKey, selectedKeys }, { eventKey, subMenuKey }) => ({
  isOpen: openKeys.indexOf(eventKey) > -1,
  active: activeKey[subMenuKey] === eventKey,
  selectedKeys,
}))(SubMenu);

connected.isSubMenu = true;

export default connected;
