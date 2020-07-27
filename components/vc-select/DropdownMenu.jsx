import raf from 'raf';
import PropTypes from '../_util/vue-types';
import Menu from '../vc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import { getSelectKeys, preventDefaultEvent, saveRef } from './util';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import { findDOMNode, getSlot } from '../_util/props-util';

export default {
  name: 'DropdownMenu',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: {
    ariaId: PropTypes.string,
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
    visible: PropTypes.bool,
    backfillValue: PropTypes.any,
    firstActiveValue: PropTypes.string,
    menuItemSelectedIcon: PropTypes.any,
  },
  watch: {
    visible(val) {
      if (!val) {
        this.lastVisible = val;
      } else {
        this.$nextTick(() => {
          this.scrollActiveItemToView();
        });
      }
    },
  },

  created() {
    this.rafInstance = null;
    this.saveMenuRef = saveRef(this, 'menuRef');
    this.lastInputValue = this.$props.inputValue;
    this.lastVisible = false;
  },

  mounted() {
    this.$nextTick(() => {
      this.scrollActiveItemToView();
    });
    this.lastVisible = this.$props.visible;
  },
  updated() {
    const props = this.$props;
    // if (!this.prevVisible && props.visible) {
    //   this.$nextTick(() => {
    //     this.scrollActiveItemToView();
    //   });
    // }
    this.lastVisible = props.visible;
    this.lastInputValue = props.inputValue;
    this.prevVisible = this.visible;
  },
  beforeUnmount() {
    if (this.rafInstance) {
      raf.cancel(this.rafInstance);
    }
  },
  methods: {
    scrollActiveItemToView() {
      // scroll into view
      const itemComponent = this.firstActiveItem && findDOMNode(this.firstActiveItem);
      const props = this.$props;
      const { value, visible, firstActiveValue } = props;
      if (!itemComponent || !visible) {
        return;
      }
      const scrollIntoViewOpts = {
        onlyScrollIfNeeded: true,
      };
      if ((!value || value.length === 0) && firstActiveValue) {
        scrollIntoViewOpts.alignWithTop = true;
      }
      // Delay to scroll since current frame item position is not ready when pre view is by filter
      // https://github.com/ant-design/ant-design/issues/11268#issuecomment-406634462
      this.rafInstance = raf(() => {
        scrollIntoView(itemComponent, findDOMNode(this.menuRef), scrollIntoViewOpts);
      });
    },

    renderMenu() {
      const props = { ...this.$props, ...this.$attrs };
      const {
        menuItems,
        menuItemSelectedIcon,
        defaultActiveFirstOption,
        prefixCls,
        multiple,
        onMenuSelect,
        inputValue,
        backfillValue,
        onMenuDeselect,
        visible,
      } = props;
      const firstActiveValue = this.firstActiveValue;
      if (menuItems && menuItems.length) {
        const menuProps = {};
        if (multiple) {
          menuProps.onDeselect = onMenuDeselect;
          menuProps.onSelect = onMenuSelect;
        } else {
          menuProps.onClick = onMenuSelect;
        }

        const value = this.value;
        const selectedKeys = getSelectKeys(menuItems, value);
        const activeKeyProps = {};

        let defaultActiveFirst = defaultActiveFirstOption;
        let clonedMenuItems = menuItems;
        if (selectedKeys.length || firstActiveValue) {
          if (props.visible && !this.lastVisible) {
            activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue;
          } else if (!visible) {
            // Do not trigger auto active since we already have selectedKeys
            if (selectedKeys[0]) {
              defaultActiveFirst = false;
            }
            activeKeyProps.activeKey = undefined;
          }
          let foundFirst = false;
          // set firstActiveItem via cloning menus
          // for scroll into view
          const clone = item => {
            if (
              (!foundFirst && selectedKeys.indexOf(item.key) !== -1) ||
              (!foundFirst && !selectedKeys.length && firstActiveValue.indexOf(item.key) !== -1)
            ) {
              foundFirst = true;
              return cloneElement(item, {
                ref: ref => {
                  this.firstActiveItem = ref;
                },
              });
            }
            return item;
          };

          clonedMenuItems = menuItems.map(item => {
            if (item.type.isMenuItemGroup) {
              const children = getSlot(item).map(clone);
              const newItem = cloneElement(item);
              newItem.children = { ...item.children, default: () => children };
              return newItem;
            }
            return clone(item);
          });
        } else {
          // Clear firstActiveItem when dropdown menu items was empty
          // Avoid `Unable to find node on an unmounted component`
          // https://github.com/ant-design/ant-design/issues/10774
          this.firstActiveItem = null;
        }

        // clear activeKey when inputValue change
        const lastValue = value && value[value.length - 1];
        if (inputValue !== this.lastInputValue && (!lastValue || lastValue !== backfillValue)) {
          activeKeyProps.activeKey = '';
        }
        return (
          <Menu
            ref={this.saveMenuRef}
            style={this.dropdownMenuStyle}
            defaultActiveFirst={defaultActiveFirst}
            role="listbox"
            itemIcon={multiple ? menuItemSelectedIcon : null}
            {...activeKeyProps}
            multiple={multiple}
            {...menuProps}
            selectedKeys={selectedKeys}
            prefixCls={`${prefixCls}-menu`}
            children={clonedMenuItems}
          ></Menu>
        );
      }
      return null;
    },
  },
  render() {
    const renderMenu = this.renderMenu();
    const { onPopupFocus, onPopupScroll } = this.$attrs;
    return renderMenu ? (
      <div
        style={{
          overflow: 'auto',
          transform: 'translateZ(0)',
        }}
        id={this.$props.ariaId}
        tabindex="-1"
        onFocus={onPopupFocus}
        onMousedown={preventDefaultEvent}
        onScroll={onPopupScroll}
      >
        {renderMenu}
      </div>
    ) : null;
  },
};
