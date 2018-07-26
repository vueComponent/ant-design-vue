'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _SubPopupMenu = require('./SubPopupMenu');

var _SubPopupMenu2 = _interopRequireDefault(_SubPopupMenu);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _util = require('./util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _requestAnimationTimeout = require('../_util/requestAnimationTimeout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var guid = 0;

var popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};

exports['default'] = {
  name: 'SubMenu',
  props: {
    mode: _vueTypes2['default'].oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    title: _vueTypes2['default'].any,
    selectedKeys: _vueTypes2['default'].array.def([]),
    openKeys: _vueTypes2['default'].array.def([]),
    openChange: _vueTypes2['default'].func.def(_util.noop),
    rootPrefixCls: _vueTypes2['default'].string,
    eventKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    multiple: _vueTypes2['default'].bool,
    active: _vueTypes2['default'].bool, // TODO: remove
    isRootMenu: _vueTypes2['default'].bool,
    index: _vueTypes2['default'].number,
    triggerSubMenuAction: _vueTypes2['default'].string,
    popupClassName: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func,
    test: _vueTypes2['default'].any,
    forceSubMenuRender: _vueTypes2['default'].bool,
    openAnimation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    disabled: _vueTypes2['default'].bool,
    subMenuOpenDelay: _vueTypes2['default'].number.def(0.1),
    subMenuCloseDelay: _vueTypes2['default'].number.def(0.1),
    level: _vueTypes2['default'].number.def(1),
    inlineIndent: _vueTypes2['default'].number.def(24),
    openTransitionName: _vueTypes2['default'].string
  },
  inject: {
    parentMenuContext: { 'default': undefined }
  },
  mixins: [_BaseMixin2['default']],
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
      (0, _requestAnimationTimeout.cancelAnimationTimeout)(this.minWidthTimeout);
      this.minWidthTimeout = null;
    }
    if (this.mouseenterTimeout) {
      (0, _requestAnimationTimeout.cancelAnimationTimeout)(this.mouseenterTimeout);
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
      this.minWidthTimeout = (0, _requestAnimationTimeout.requestAnimationTimeout)(function () {
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

      if (keyCode === _KeyCode2['default'].ENTER) {
        this.onTitleClick(e);
        this.setState({
          defaultActiveFirst: true
        });
        return true;
      }

      if (keyCode === _KeyCode2['default'].RIGHT) {
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
      if (keyCode === _KeyCode2['default'].LEFT) {
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

      if (isOpen && (keyCode === _KeyCode2['default'].UP || keyCode === _KeyCode2['default'].DOWN)) {
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
      return (0, _extends3['default'])({}, info, {
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
        this.mouseenterTimeout = (0, _requestAnimationTimeout.requestAnimationTimeout)(function () {
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
      (0, _util.loopMenuItemRecusively)(this.$slots['default'], this.$props.selectedKeys, ret);
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
        _SubPopupMenu2['default'],
        (0, _babelHelperVueJsxMergeProps2['default'])([{
          directives: [{
            name: 'show',
            value: isOpen
          }]
        }, subPopupMenuProps]),
        [children]
      ) : h(
        _SubPopupMenu2['default'],
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
    var className = (_className = {}, (0, _defineProperty3['default'])(_className, prefixCls, true), (0, _defineProperty3['default'])(_className, prefixCls + '-' + props.mode, true), (0, _defineProperty3['default'])(_className, this.getOpenClassName(), isOpen), (0, _defineProperty3['default'])(_className, this.getActiveClassName(), props.active || isOpen && !isInlineMode), (0, _defineProperty3['default'])(_className, this.getDisabledClassName(), props.disabled), (0, _defineProperty3['default'])(_className, this.getSelectedClassName(), this.isChildrenSelected()), _className);

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
      on: (0, _extends3['default'])({}, titleMouseEvents, titleClickEvents),
      style: style,
      'class': prefixCls + '-title',
      ref: 'subMenuTitle'
    };
    var title = h(
      'div',
      titleProps,
      [(0, _propsUtil.getComponentFromProp)(this, 'title'), h('i', { 'class': prefixCls + '-arrow' })]
    );
    // const children = this.renderChildren(this.$slots.default)

    var getPopupContainer = this.isRootMenu ? this.parentMenuContext.getPopupContainer : function (triggerNode) {
      return triggerNode.parentNode;
    };
    var popupPlacement = popupPlacementMap[props.mode];
    var popupClassName = props.mode === 'inline' ? '' : props.popupClassName;
    var liProps = {
      on: (0, _extends3['default'])({}, mouseEvents),
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
    } else if ((typeof openAnimation === 'undefined' ? 'undefined' : (0, _typeof3['default'])(openAnimation)) === 'object') {
      animProps = (0, _extends3['default'])({}, animProps, openAnimation.props || {});
      if (!transitionAppear) {
        animProps.appear = false;
      }
    } else if (typeof openAnimation === 'string') {
      animProps.name = openAnimation;
    }
    var transitionProps = {
      props: animProps
    };
    if ((typeof openAnimation === 'undefined' ? 'undefined' : (0, _typeof3['default'])(openAnimation)) === 'object' && openAnimation.on) {
      transitionProps.on = (0, _extends3['default'])({}, openAnimation.on);
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
        _trigger2['default'],
        {
          attrs: {
            prefixCls: prefixCls,
            popupClassName: prefixCls + '-popup ' + rootPrefixCls + '-' + parentMenuContext.theme + ' ' + (popupClassName || ''),
            getPopupContainer: getPopupContainer,
            builtinPlacements: _placements2['default'],
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
module.exports = exports['default'];