import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import Menu from '../vc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import { getSelectKeys, preventDefaultEvent } from './util';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import { getSlotOptions } from '../_util/props-util';

export default {
  name: 'DropdownMenu',
  mixins: [BaseMixin],
  props: {
    defaultActiveFirstOption: PropTypes.bool,
    value: PropTypes.any,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    // onMenuDeSelect: PropTypes.func,
    // onMenuSelect: PropTypes.func,
    prefixCls: PropTypes.string,
    menuItems: PropTypes.any,
    inputValue: PropTypes.string,
    visible: PropTypes.bool
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

        scrollIntoView(itemComponent, this.$refs.menuRef.$el, scrollIntoViewOpts);
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
        var selectedKeys = getSelectKeys(menuItems, value);
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
              return cloneElement(item, {
                ref: 'firstActiveItem'
              });
            }
            return item;
          };

          clonedMenuItems = menuItems.map(function (item) {
            if (getSlotOptions(item).isMenuItemGroup) {
              var children = item.componentOptions.children.map(clone);
              return cloneElement(item, { children: children });
            }
            return clone(item);
          });
        }

        // clear activeKey when inputValue change
        var lastValue = value && value[value.length - 1];
        if (inputValue !== this.lastInputValue && (!lastValue || !lastValue.backfill)) {
          activeKeyProps.activeKey = '';
        }
        menuProps.props = _extends({}, menuProps.props, activeKeyProps);
        return h(
          Menu,
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
          'mousedown': preventDefaultEvent,
          'scroll': popupScroll
        },

        ref: 'menuContainer'
      },
      [renderMenu]
    ) : null;
  }
};