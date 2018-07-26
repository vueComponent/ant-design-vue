'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcMenu = require('../vc-menu');

var _vcMenu2 = _interopRequireDefault(_vcMenu);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _util = require('./util');

var _vnode = require('../_util/vnode');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'DropdownMenu',
  mixins: [_BaseMixin2['default']],
  props: {
    defaultActiveFirstOption: _vueTypes2['default'].bool,
    value: _vueTypes2['default'].any,
    dropdownMenuStyle: _vueTypes2['default'].object,
    multiple: _vueTypes2['default'].bool,
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    // onMenuDeSelect: PropTypes.func,
    // onMenuSelect: PropTypes.func,
    prefixCls: _vueTypes2['default'].string,
    menuItems: _vueTypes2['default'].any,
    inputValue: _vueTypes2['default'].string,
    visible: _vueTypes2['default'].bool
  },

  beforeMount: function beforeMount() {
    this.lastInputValue = this.$props.inputValue;
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.scrollActiveItemToView();
    });
    this.lastVisible = this.$props.visible;
  },

  watch: {
    visible: function visible(val) {
      if (!val) {
        this.lastVisible = val;
      }
    }
  },
  updated: function updated() {
    var _this2 = this;

    var props = this.$props;
    if (!this.prevVisible && props.visible) {
      this.$nextTick(function () {
        _this2.scrollActiveItemToView();
      });
    }
    this.lastVisible = props.visible;
    this.lastInputValue = props.inputValue;
    this.prevVisible = this.visible;
  },

  methods: {
    scrollActiveItemToView: function scrollActiveItemToView() {
      // scroll into view
      var itemComponent = this.$refs.firstActiveItem && this.$refs.firstActiveItem.$el;
      var props = this.$props;

      if (itemComponent) {
        var scrollIntoViewOpts = {
          onlyScrollIfNeeded: true
        };
        if ((!props.value || props.value.length === 0) && props.firstActiveValue) {
          scrollIntoViewOpts.alignWithTop = true;
        }

        (0, _domScrollIntoView2['default'])(itemComponent, this.$refs.menuRef.$el, scrollIntoViewOpts);
      }
    },
    renderMenu: function renderMenu() {
      var h = this.$createElement;

      var props = this.$props;
      var menuItems = props.menuItems,
          defaultActiveFirstOption = props.defaultActiveFirstOption,
          value = props.value,
          prefixCls = props.prefixCls,
          multiple = props.multiple,
          inputValue = props.inputValue,
          firstActiveValue = props.firstActiveValue,
          dropdownMenuStyle = props.dropdownMenuStyle;
      var _$listeners = this.$listeners,
          menuDeselect = _$listeners.menuDeselect,
          menuSelect = _$listeners.menuSelect,
          popupScroll = _$listeners.popupScroll;

      if (menuItems && menuItems.length) {
        var selectedKeys = (0, _util.getSelectKeys)(menuItems, value);
        var menuProps = {
          props: {
            multiple: multiple,
            defaultActiveFirst: defaultActiveFirstOption,
            selectedKeys: selectedKeys,
            prefixCls: prefixCls + '-menu'
          },
          on: {},
          style: dropdownMenuStyle,
          ref: 'menuRef'
        };
        if (popupScroll) {
          menuProps.on.scroll = popupScroll;
        }
        if (multiple) {
          menuProps.on.deselect = menuDeselect;
          menuProps.on.select = menuSelect;
        } else {
          menuProps.on.click = menuSelect;
        }
        var activeKeyProps = {};

        var clonedMenuItems = menuItems;
        if (selectedKeys.length || firstActiveValue) {
          if (props.visible && !this.lastVisible) {
            activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
          }
          var foundFirst = false;
          // set firstActiveItem via cloning menus
          // for scroll into view
          var clone = function clone(item) {
            if (!foundFirst && selectedKeys.indexOf(item.key) !== -1 || !foundFirst && !selectedKeys.length && firstActiveValue.indexOf(item.key) !== -1) {
              foundFirst = true;
              return (0, _vnode.cloneElement)(item, {
                ref: 'firstActiveItem'
              });
            }
            return item;
          };

          clonedMenuItems = menuItems.map(function (item) {
            if ((0, _propsUtil.getSlotOptions)(item).isMenuItemGroup) {
              var children = item.componentOptions.children.map(clone);
              return (0, _vnode.cloneElement)(item, { children: children });
            }
            return clone(item);
          });
        }

        // clear activeKey when inputValue change
        var lastValue = value && value[value.length - 1];
        if (inputValue !== this.lastInputValue && (!lastValue || !lastValue.backfill)) {
          activeKeyProps.activeKey = '';
        }
        menuProps.props = (0, _extends3['default'])({}, menuProps.props, activeKeyProps);
        return h(
          _vcMenu2['default'],
          menuProps,
          [clonedMenuItems]
        );
      }
      return null;
    }
  },
  render: function render() {
    var h = arguments[0];

    var renderMenu = this.renderMenu();
    var _$listeners2 = this.$listeners,
        popupFocus = _$listeners2.popupFocus,
        popupScroll = _$listeners2.popupScroll;

    return renderMenu ? h(
      'div',
      {
        style: { overflow: 'auto' },
        on: {
          'focus': popupFocus,
          'mousedown': _util.preventDefaultEvent,
          'scroll': popupScroll
        },

        ref: 'menuContainer'
      },
      [renderMenu]
    ) : null;
  }
};
module.exports = exports['default'];