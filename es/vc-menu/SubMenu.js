import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import Trigger from '../trigger';
import KeyCode from '../_util/KeyCode';
import SubPopupMenu from './SubPopupMenu';
import placements from './placements';
import { loopMenuItemRecusively, noop } from './util';
import BaseMixin from '../_util/BaseMixin';
import { getComponentFromProp } from '../_util/props-util';
import { requestAnimationTimeout, cancelAnimationTimeout } from '../_util/requestAnimationTimeout';

var guid = 0;

var popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};

export default {
  name: 'SubMenu',
  props: {
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    title: PropTypes.any,
    selectedKeys: PropTypes.array.def([]),
    openKeys: PropTypes.array.def([]),
    openChange: PropTypes.func.def(noop),
    rootPrefixCls: PropTypes.string,
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    active: PropTypes.bool, // TODO: remove
    isRootMenu: PropTypes.bool,
    index: PropTypes.number,
    triggerSubMenuAction: PropTypes.string,
    popupClassName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    test: PropTypes.any,
    forceSubMenuRender: PropTypes.bool,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    subMenuOpenDelay: PropTypes.number.def(0.1),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    level: PropTypes.number.def(1),
    inlineIndent: PropTypes.number.def(24),
    openTransitionName: PropTypes.string
  },
  inject: {
    parentMenuContext: { 'default': undefined }
  },
  mixins: [BaseMixin],
  isSubMenu: true,
  data: function data() {
    return {
      defaultActiveFirst: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.handleUpdated();
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.handleUpdated();
    });
  },
  beforeDestroy: function beforeDestroy() {
    var eventKey = this.eventKey;

    this.__emit('destroy', eventKey);
    // if (parentMenuContext.subMenuInstance === this) {
    //   this.clearSubMenuTimers()
    // }
    if (this.minWidthTimeout) {
      cancelAnimationTimeout(this.minWidthTimeout);
      this.minWidthTimeout = null;
    }
    if (this.mouseenterTimeout) {
      cancelAnimationTimeout(this.mouseenterTimeout);
      this.mouseenterTimeout = null;
    }
  },

  methods: {
    handleUpdated: function handleUpdated() {
      var _$props = this.$props,
          mode = _$props.mode,
          isRootMenu = _$props.isRootMenu;

      if (mode !== 'horizontal' || !isRootMenu || !this.isOpen()) {
        return;
      }
      var self = this;
      this.minWidthTimeout = requestAnimationTimeout(function () {
        if (!self.$refs.subMenuTitle || !self.$refs.menuInstance) {
          return;
        }
        var popupMenu = self.$refs.menuInstance.$el;
        if (popupMenu.offsetWidth >= self.$refs.subMenuTitle.offsetWidth) {
          return;
        }
        popupMenu.style.minWidth = self.$refs.subMenuTitle.offsetWidth + 'px';
      }, 0);
    },
    onKeyDown: function onKeyDown(e) {
      var keyCode = e.keyCode;
      var menu = this.$refs.menuInstance;
      var isOpen = this.isOpen();

      if (keyCode === KeyCode.ENTER) {
        this.onTitleClick(e);
        this.setState({
          defaultActiveFirst: true
        });
        return true;
      }

      if (keyCode === KeyCode.RIGHT) {
        if (isOpen) {
          menu.onKeyDown(e);
        } else {
          this.triggerOpenChange(true);
          this.setState({
            defaultActiveFirst: true
          });
        }
        return true;
      }
      if (keyCode === KeyCode.LEFT) {
        var handled = void 0;
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
    onPopupVisibleChange: function onPopupVisibleChange(visible) {
      this.triggerOpenChange(visible, visible ? 'mouseenter' : 'mouseleave');
    },
    onMouseEnter: function onMouseEnter(e) {
      var key = this.$props.eventKey;
      // this.clearSubMenuLeaveTimer()

      this.setState({
        defaultActiveFirst: false
      });
      this.__emit('mouseenter', {
        key: key,
        domEvent: e
      });
    },
    onMouseLeave: function onMouseLeave(e) {
      var eventKey = this.eventKey,
          parentMenuContext = this.parentMenuContext;

      parentMenuContext.subMenuInstance = this;
      // parentMenuContext.subMenuLeaveFn = () => {
      // // trigger mouseleave
      //   this.__emit('mouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      this.__emit('mouseleave', {
        key: eventKey,
        domEvent: e
      });
      // prevent popup menu and submenu gap
      // parentMenuContext.subMenuLeaveTimer = setTimeout(parentMenuContext.subMenuLeaveFn, 100)
    },
    onTitleMouseEnter: function onTitleMouseEnter(domEvent) {
      var key = this.$props.eventKey;
      // this.clearSubMenuTitleLeaveTimer()

      this.__emit('itemHover', {
        key: key,
        hover: true
      });
      this.__emit('titleMouseenter', {
        key: key,
        domEvent: domEvent
      });
    },
    onTitleMouseLeave: function onTitleMouseLeave(e) {
      var eventKey = this.eventKey,
          parentMenuContext = this.parentMenuContext;

      parentMenuContext.subMenuInstance = this;
      this.__emit('itemHover', {
        key: eventKey,
        hover: false
      });
      this.__emit('titleMouseleave', {
        key: eventKey,
        domEvent: e
      });
      // parentMenuContext.subMenuTitleLeaveFn = () => {
      //   this.__emit('itemHover', {
      //     key: eventKey,
      //     hover: false,
      //   })
      //   this.__emit('titleMouseleave', {
      //     key: eventKey,
      //     domEvent: e,
      //   })
      // }
      // parentMenuContext.subMenuTitleLeaveTimer = setTimeout(parentMenuContext.subMenuTitleLeaveFn, 100)
    },
    onTitleClick: function onTitleClick(e) {
      var _$props2 = this.$props,
          triggerSubMenuAction = _$props2.triggerSubMenuAction,
          eventKey = _$props2.eventKey;

      this.$emit('titleClick', {
        key: eventKey,
        domEvent: e
      });
      if (triggerSubMenuAction === 'hover') {
        return;
      }
      this.triggerOpenChange(!this.isOpen(), 'click');
      this.setState({
        defaultActiveFirst: false
      });
    },
    onSubMenuClick: function onSubMenuClick(info) {
      this.__emit('click', this.addKeyPath(info));
    },
    getPrefixCls: function getPrefixCls() {
      return this.$props.rootPrefixCls + '-submenu';
    },
    getActiveClassName: function getActiveClassName() {
      return this.getPrefixCls() + '-active';
    },
    getDisabledClassName: function getDisabledClassName() {
      return this.getPrefixCls() + '-disabled';
    },
    getSelectedClassName: function getSelectedClassName() {
      return this.getPrefixCls() + '-selected';
    },
    getOpenClassName: function getOpenClassName() {
      return this.$props.rootPrefixCls + '-submenu-open';
    },
    addKeyPath: function addKeyPath(info) {
      return _extends({}, info, {
        keyPath: (info.keyPath || []).concat(this.$props.eventKey)
      });
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
    triggerOpenChange: function triggerOpenChange(open, type) {
      var _this3 = this;

      var key = this.$props.eventKey;
      var openChange = function openChange() {
        _this3.__emit('openChange', {
          key: key,
          item: _this3,
          trigger: type,
          open: open
        });
      };
      if (type === 'mouseenter') {
        // make sure mouseenter happen after other menu item's mouseleave
        this.mouseenterTimeout = requestAnimationTimeout(function () {
          openChange();
        }, 0);
      } else {
        openChange();
      }
    },


    // clearSubMenuTimers () {
    //   this.clearSubMenuLeaveTimer()
    //   this.clearSubMenuTitleLeaveTimer()
    // },

    // clearSubMenuTitleLeaveTimer () {
    //   const parentMenuContext = this.parentMenuContext
    //   if (parentMenuContext.subMenuTitleLeaveTimer) {
    //     clearTimeout(parentMenuContext.subMenuTitleLeaveTimer)
    //     parentMenuContext.subMenuTitleLeaveTimer = null
    //     parentMenuContext.subMenuTitleLeaveFn = null
    //   }
    // },

    // clearSubMenuLeaveTimer () {
    //   const parentMenuContext = this.parentMenuContext
    //   if (parentMenuContext.subMenuLeaveTimer) {
    //     clearTimeout(parentMenuContext.subMenuLeaveTimer)
    //     parentMenuContext.subMenuLeaveTimer = null
    //     parentMenuContext.subMenuLeaveFn = null
    //   }
    // },

    isChildrenSelected: function isChildrenSelected() {
      var ret = { find: false };
      loopMenuItemRecusively(this.$slots['default'], this.$props.selectedKeys, ret);
      return ret.find;
    },
    isOpen: function isOpen() {
      return this.$props.openKeys.indexOf(this.$props.eventKey) !== -1;
    },
    renderChildren: function renderChildren(children, vShow) {
      var h = this.$createElement;

      var props = this.$props;
      var isOpen = this.isOpen();
      var _$listeners = this.$listeners,
          select = _$listeners.select,
          deselect = _$listeners.deselect,
          openChange = _$listeners.openChange;

      var subPopupMenuProps = {
        props: {
          mode: props.mode === 'horizontal' ? 'vertical' : props.mode,
          visible: isOpen,
          level: props.level + 1,
          inlineIndent: props.inlineIndent,
          focusable: false,
          selectedKeys: props.selectedKeys,
          eventKey: props.eventKey + '-menu-',
          openKeys: props.openKeys,
          openTransitionName: props.openTransitionName,
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender,
          triggerSubMenuAction: props.triggerSubMenuAction,
          defaultActiveFirst: this.$data.defaultActiveFirst,
          multiple: props.multiple,
          prefixCls: props.rootPrefixCls
          // clearSubMenuTimers: this.clearSubMenuTimers,
        },
        on: {
          click: this.onSubMenuClick,
          select: select, deselect: deselect, openChange: openChange
        },
        id: this._menuId,
        ref: 'menuInstance'
      };
      return vShow ? h(
        SubPopupMenu,
        _mergeJSXProps([{
          directives: [{
            name: 'show',
            value: isOpen
          }]
        }, subPopupMenuProps]),
        [children]
      ) : h(
        SubPopupMenu,
        subPopupMenuProps,
        [children]
      );
    }
  },

  render: function render(h) {
    var _className;

    var props = this.$props;
    var rootPrefixCls = this.rootPrefixCls,
        parentMenuContext = this.parentMenuContext;

    var isOpen = this.isOpen();
    var prefixCls = this.getPrefixCls();
    var isInlineMode = props.mode === 'inline';
    var className = (_className = {}, _defineProperty(_className, prefixCls, true), _defineProperty(_className, prefixCls + '-' + props.mode, true), _defineProperty(_className, this.getOpenClassName(), isOpen), _defineProperty(_className, this.getActiveClassName(), props.active || isOpen && !isInlineMode), _defineProperty(_className, this.getDisabledClassName(), props.disabled), _defineProperty(_className, this.getSelectedClassName(), this.isChildrenSelected()), _className);

    if (!this._menuId) {
      if (props.eventKey) {
        this._menuId = props.eventKey + '$Menu';
      } else {
        this._menuId = '$__$' + ++guid + '$Menu';
      }
    }

    var mouseEvents = {};
    var titleClickEvents = {};
    var titleMouseEvents = {};
    if (!props.disabled) {
      mouseEvents = {
        mouseleave: this.onMouseLeave,
        mouseenter: this.onMouseEnter

        // only works in title, not outer li
      };titleClickEvents = {
        click: this.onTitleClick
      };
      titleMouseEvents = {
        mouseenter: this.onTitleMouseEnter,
        mouseleave: this.onTitleMouseLeave
      };
    }

    var style = {};
    if (isInlineMode) {
      style.paddingLeft = props.inlineIndent * props.level + 'px';
    }
    var titleProps = {
      attrs: {
        'aria-expanded': isOpen,
        'aria-owns': this._menuId,
        'aria-haspopup': 'true',
        title: typeof props.title === 'string' ? props.title : undefined
      },
      on: _extends({}, titleMouseEvents, titleClickEvents),
      style: style,
      'class': prefixCls + '-title',
      ref: 'subMenuTitle'
    };
    var title = h(
      'div',
      titleProps,
      [getComponentFromProp(this, 'title'), h('i', { 'class': prefixCls + '-arrow' })]
    );
    // const children = this.renderChildren(this.$slots.default)

    var getPopupContainer = this.isRootMenu ? this.parentMenuContext.getPopupContainer : function (triggerNode) {
      return triggerNode.parentNode;
    };
    var popupPlacement = popupPlacementMap[props.mode];
    var popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    var liProps = {
      on: _extends({}, mouseEvents),
      'class': className
    };

    var _$props3 = this.$props,
        forceSubMenuRender = _$props3.forceSubMenuRender,
        mode = _$props3.mode,
        openTransitionName = _$props3.openTransitionName,
        openAnimation = _$props3.openAnimation;

    var haveRendered = this.haveRendered;
    this.haveRendered = true;

    this.haveOpened = this.haveOpened || isOpen || forceSubMenuRender;

    var transitionAppear = !(!haveRendered && isOpen && mode === 'inline');

    var animProps = { appear: true };
    if (openTransitionName) {
      animProps.name = openTransitionName;
    } else if ((typeof openAnimation === 'undefined' ? 'undefined' : _typeof(openAnimation)) === 'object') {
      animProps = _extends({}, animProps, openAnimation.props || {});
      if (!transitionAppear) {
        animProps.appear = false;
      }
    } else if (typeof openAnimation === 'string') {
      animProps.name = openAnimation;
    }
    var transitionProps = {
      props: animProps
    };
    if ((typeof openAnimation === 'undefined' ? 'undefined' : _typeof(openAnimation)) === 'object' && openAnimation.on) {
      transitionProps.on = _extends({}, openAnimation.on);
    }
    var children = this.renderChildren(this.$slots['default'], isInlineMode);
    return h(
      'li',
      liProps,
      [isInlineMode && title, isInlineMode && h(
        'transition',
        transitionProps,
        [children]
      ), !isInlineMode && h(
        Trigger,
        {
          attrs: {
            prefixCls: prefixCls,
            popupClassName: prefixCls + '-popup ' + rootPrefixCls + '-' + parentMenuContext.theme + ' ' + (popupClassName || ''),
            getPopupContainer: getPopupContainer,
            builtinPlacements: placements,
            popupPlacement: popupPlacement,
            popupVisible: isOpen,
            action: props.disabled ? [] : [props.triggerSubMenuAction],
            mouseEnterDelay: props.subMenuOpenDelay,
            mouseLeaveDelay: props.subMenuCloseDelay,

            forceRender: props.forceSubMenuRender
            // popupTransitionName='rc-menu-open-slide-up'
            , popupAnimation: transitionProps
          },
          on: {
            'popupVisibleChange': this.onPopupVisibleChange
          }
        },
        [h(
          'template',
          { slot: 'popup' },
          [this.haveOpened ? children : null]
        ), title]
      )]
    );
  }
};