'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _icon = require('../../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  props: {
    prefixCls: {
      'default': 'ant-tabs',
      type: String
    },
    tabBarPosition: {
      'default': 'top',
      type: String
    },
    disabled: Boolean,
    activeKey: String,
    panels: Array,
    hideAdd: Boolean,
    removeTab: {
      'default': noop,
      type: Function
    },
    createNewTab: {
      'default': noop,
      type: Function
    },
    tabBarGutter: Number
  },
  methods: {
    getTabs: function getTabs(h) {
      var _this = this;

      var children = this.panels,
          activeKey = this.activeKey,
          prefixCls = this.prefixCls,
          tabBarGutter = this.tabBarGutter;

      var rst = [];
      children.forEach(function (child, index) {
        if (!child) {
          return;
        }
        var disabled = child.disabled,
            closable = child.closable;
        var tabKey = child.tabKey,
            tab = child.tab;
        // componentOptions.propsData中获取的值disabled没有根据类型初始化, 会出现空字符串

        disabled = disabled === '' || disabled;
        var cls = activeKey === tabKey ? prefixCls + '-tab-active' : '';
        cls += ' ' + prefixCls + '-tab';
        if (disabled) {
          cls += ' ' + prefixCls + '-tab-disabled';
        } else {}
        var onClick = function onClick(e) {
          !disabled && _this.__emit('tabClick', tabKey, e);
        };

        var tabC = typeof tab === 'function' ? child.tab(h) : tab;
        if (_this.$parent.type === 'editable-card') {
          closable = closable === undefined ? true : closable === '' || closable;
          var closeIcon = closable ? h(_icon2['default'], {
            attrs: {
              type: 'close'
            },
            on: {
              'click': function click(e) {
                return _this.removeTab(tabKey, e);
              }
            }
          }) : null;
          tabC = h(
            'div',
            { 'class': closable ? undefined : prefixCls + '-tab-unclosable' },
            [tabC, closeIcon]
          );
        }

        rst.push(h(
          'div',
          {
            attrs: {
              role: 'tab',
              'aria-disabled': disabled ? 'true' : 'false',
              'aria-selected': activeKey === tabKey ? 'true' : 'false'
            },
            'class': cls,
            key: tabKey,
            on: {
              'click': onClick
            },

            style: { marginRight: tabBarGutter && index === children.length - 1 ? '0px' : tabBarGutter + 'px' },
            ref: activeKey === tabKey ? 'activeTab' : undefined
          },
          [tabC]
        ));
      });

      return rst;
    },
    onKeyDown: function onKeyDown(e) {
      this.__emit('keydown', e);
    },
    getRootNode: function getRootNode(contents, createElement) {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          onKeyDown = this.onKeyDown,
          tabBarPosition = this.tabBarPosition,
          hideAdd = this.hideAdd;

      var extraContent = this.$slots.extraContent;
      var tabsType = this.$parent.type;
      var cls = (0, _defineProperty3['default'])({}, prefixCls + '-bar', true);
      var topOrBottom = tabBarPosition === 'top' || tabBarPosition === 'bottom';
      var tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
      var children = contents;
      if (tabsType === 'editable-card' && !hideAdd) {
        extraContent = h('span', [h(_icon2['default'], {
          attrs: { type: 'plus' },
          'class': prefixCls + '-new-tab', on: {
            'click': this.createNewTab
          }
        }), extraContent]);
      }

      children = [h(
        'div',
        { key: 'extra', 'class': prefixCls + '-extra-content', style: tabBarExtraContentStyle },
        [extraContent]
      ), contents];
      children = topOrBottom ? children : children.reverse();

      return h(
        'div',
        {
          attrs: {
            role: 'tablist',

            tabIndex: '0'
          },
          'class': cls, ref: 'root',
          on: {
            'keydown': onKeyDown
          }
        },
        [children]
      );
    }
  }
};
module.exports = exports['default'];