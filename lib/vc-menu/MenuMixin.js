'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propsUtil = require('../_util/props-util');

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _util = require('./util');

var _vnode = require('../_util/vnode');

var _DOMWrap = require('./DOMWrap');

var _DOMWrap2 = _interopRequireDefault(_DOMWrap);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function allDisabled(arr) {
  if (!arr.length) {
    return true;
  }
  return arr.every(function (c) {
    return !!c.disabled;
  });
}

exports['default'] = {
  data: function data() {
    var props = this.$props;
    return {
      sActiveKey: this.getActiveKey(props.activeKey)
    };
  },
  provide: function provide() {
    return {
      parentMenuContext: this
    };
  },

  watch: {
    '$props': {
      handler: function handler(nextProps) {
        var props = void 0;
        if ((0, _propsUtil.hasProp)(this, 'activeKey')) {
          props = {
            sActiveKey: this.getActiveKey(nextProps.activeKey)
          };
        } else {
          var originalActiveKey = this.$data.sActiveKey;
          var sActiveKey = this.getActiveKey(originalActiveKey);
          // fix: this.setState(), parent.render(),
          if (sActiveKey !== originalActiveKey) {
            props = {
              sActiveKey: sActiveKey
            };
          }
        }
        if (props) {
          this.setState(props);
        }
      },
      deep: true
    }
  },
  methods: {
    getActiveKey: function getActiveKey(originalActiveKey) {
      var activeKey = originalActiveKey;
      var _$props = this.$props,
          eventKey = _$props.eventKey,
          defaultActiveFirst = _$props.defaultActiveFirst;

      var children = this.$slots['default'];
      if (activeKey) {
        var found = void 0;
        (0, _util.loopMenuItem)(children, function (c, i) {
          var propsData = c.componentOptions.propsData || {};
          if (c && !propsData.disabled && activeKey === (0, _util.getKeyFromChildrenIndex)(c, eventKey, i)) {
            found = true;
          }
        });
        if (found) {
          return activeKey;
        }
      }
      activeKey = null;
      if (defaultActiveFirst) {
        (0, _util.loopMenuItem)(children, function (c, i) {
          var propsData = c.componentOptions.propsData || {};
          if (!activeKey && c && !propsData.disabled) {
            activeKey = (0, _util.getKeyFromChildrenIndex)(c, eventKey, i);
          }
        });
        return activeKey;
      }
      return activeKey;
    },

    // all keyboard events callbacks run from here at first
    onKeyDown: function onKeyDown(e) {
      var _this = this;

      var keyCode = e.keyCode;
      var handled = void 0;
      this.getFlatInstanceArray().forEach(function (obj) {
        if (obj && obj.active) {
          handled = obj.onKeyDown(e);
        }
      });
      if (handled) {
        return 1;
      }
      var activeItem = null;
      if (keyCode === _KeyCode2['default'].UP || keyCode === _KeyCode2['default'].DOWN) {
        activeItem = this.step(keyCode === _KeyCode2['default'].UP ? -1 : 1);
      }
      if (activeItem) {
        e.preventDefault();
        this.setState({
          sActiveKey: activeItem.eventKey
        }, function () {
          (0, _domScrollIntoView2['default'])(activeItem.$el, _this.$el, {
            onlyScrollIfNeeded: true
          });
        });
        return 1;
      } else if (activeItem === undefined) {
        e.preventDefault();
        this.setState({
          sActiveKey: null
        });
        return 1;
      }
    },
    onItemHover: function onItemHover(e) {
      var key = e.key,
          hover = e.hover;

      this.setState({
        sActiveKey: hover ? key : null
      });
    },
    getFlatInstanceArray: function getFlatInstanceArray() {
      var instance = [];
      try {
        instance = this.$children[0].$children || [];
      } catch (error) {}
      return instance;
    },
    renderCommonMenuItem: function renderCommonMenuItem(child, i, subIndex, extraProps) {
      if (child.tag === undefined) {
        return child;
      }
      (0, _warning2['default'])(['MenuItem', 'MenuItemGroup', 'SubMenu', 'MenuDivider', 'AMenuItem', 'AMenuItemGroup', 'ASubMenu', 'AMenuDivider'].includes((0, _propsUtil.getComponentName)(child.componentOptions)), 'Menu children not support ' + (0, _propsUtil.getComponentName)(child.componentOptions));
      var state = this.$data;
      var props = this.$props;
      var key = (0, _util.getKeyFromChildrenIndex)(child, props.eventKey, i);
      var childProps = child.componentOptions.propsData || {};
      var isActive = key === state.sActiveKey;
      var newChildProps = {
        props: (0, _extends3['default'])({
          mode: props.mode,
          level: props.level,
          inlineIndent: props.inlineIndent,
          renderMenuItem: this.renderMenuItem,
          rootPrefixCls: props.prefixCls,
          index: i,
          eventKey: key,
          active: !childProps.disabled && isActive,
          multiple: props.multiple,
          openTransitionName: this.getOpenTransitionName(),
          openAnimation: props.openAnimation,
          subMenuOpenDelay: props.subMenuOpenDelay,
          subMenuCloseDelay: props.subMenuCloseDelay,
          forceSubMenuRender: props.forceSubMenuRender
        }, extraProps, {
          openChange: this.onOpenChange
        }),
        on: {
          click: this.onClick,
          itemHover: this.onItemHover,
          openChange: this.onOpenChange,
          deselect: this.onDeselect,
          // destroy: this.onDestroy,
          select: this.onSelect
        }
      };
      if (props.mode === 'inline') {
        newChildProps.props.triggerSubMenuAction = 'click';
      }
      // if (!extraProps.isRootMenu) {
      //   newChildProps.props.clearSubMenuTimers = this.clearSubMenuTimers
      // }
      return (0, _vnode.cloneElement)(child, newChildProps);
    },
    renderRoot: function renderRoot(props) {
      var _className,
          _this2 = this;

      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var h = this.$createElement;

      var className = (_className = {}, (0, _defineProperty3['default'])(_className, props.prefixCls, true), (0, _defineProperty3['default'])(_className, props['class'], true), (0, _defineProperty3['default'])(_className, props.prefixCls + '-' + props.mode, true), _className);
      var domProps = {
        attrs: {
          role: 'menu',
          'aria-activedescendant': ''
        },
        props: {
          tag: 'ul'
          // hiddenClassName: `${props.prefixCls}-hidden`,
          // visible: props.visible,
        },
        'class': className,
        on: {}
      };
      if (this.$listeners.popupScroll) {
        domProps.on.scroll = this.$listeners.popupScroll;
      }
      if (props.id) {
        domProps.id = props.id;
      }
      if (props.focusable) {
        domProps.attrs.tabIndex = '0';
        domProps.on.keydown = this.onKeyDown;
      }
      var newChildren = children.map(function (c, i) {
        return _this2.renderMenuItem(c, i);
      });
      return h(
        _DOMWrap2['default'],
        domProps,
        [newChildren]
      );
    },
    step: function step(direction) {
      var children = this.getFlatInstanceArray();
      var sActiveKey = this.$data.sActiveKey;
      var len = children.length;
      if (!len) {
        return null;
      }
      if (direction < 0) {
        children = children.concat().reverse();
      }
      // find current activeIndex
      var activeIndex = -1;
      children.every(function (c, ci) {
        if (c && c.eventKey === sActiveKey) {
          activeIndex = ci;
          return false;
        }
        return true;
      });
      if (!this.$props.defaultActiveFirst && activeIndex !== -1) {
        if (allDisabled(children.slice(activeIndex, len - 1))) {
          return undefined;
        }
      }
      var start = (activeIndex + 1) % len;
      var i = start;
      for (;;) {
        var child = children[i];
        if (!child || child.disabled) {
          i = (i + 1 + len) % len;
          // complete a loop
          if (i === start) {
            return null;
          }
        } else {
          return child;
        }
      }
    }
  }
};
module.exports = exports['default'];