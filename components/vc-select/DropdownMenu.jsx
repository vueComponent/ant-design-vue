import raf from 'raf';
import PropTypes from '../_util/vue-types';
import Menu from '../vc-menu';
import scrollIntoView from 'dom-scroll-into-view';
import { getSelectKeys, preventDefaultEvent } from './util';
import { cloneElement, cloneVNode } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import { getSlotOptions, getComponentFromProp, getListeners } from '../_util/props-util';

export default {
  name: 'DropdownMenu',
  mixins: [BaseMixin],
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
    virtual: PropTypes.bool,
  },
  data() {
    return {
      lineHeight: 32,
      height: 250,
      startV: 0,
      preloadCount: 50, //预加载数量
    };
  },
  computed: {
    renderMenu() {
      const props = this.$props;
      const {
        menuItems,
        defaultActiveFirstOption,
        value,
        prefixCls,
        multiple,
        inputValue,
        firstActiveValue,
        dropdownMenuStyle,
        backfillValue,
        visible,
      } = props;
      const menuItemSelectedIcon = getComponentFromProp(this, 'menuItemSelectedIcon');
      const { menuDeselect, menuSelect, popupScroll } = getListeners(this);
      if (menuItems && menuItems.length) {
        const selectedKeys = getSelectKeys(menuItems, value);
        const menuProps = {
          props: {
            multiple,
            itemIcon: multiple ? menuItemSelectedIcon : null,
            selectedKeys,
            prefixCls: `${prefixCls}-menu`,
          },
          on: {},
          style: dropdownMenuStyle,
          ref: 'menuRef',
          attrs: {
            role: 'listbox',
          },
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
                directives: [
                  {
                    name: 'ant-ref',
                    value: ref => {
                      this.firstActiveItem = ref;
                    },
                  },
                ],
              });
            }
            return item;
          };

          clonedMenuItems = menuItems.map(item => {
            if (getSlotOptions(item).isMenuItemGroup) {
              const children = item.componentOptions.children.map(clone);
              return cloneElement(item, { children });
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
        menuProps.props = { ...activeKeyProps, ...menuProps.props, defaultActiveFirst };
        if (this.$props.virtual) {
          let flatClonedMenuItems = this.flattenNode(clonedMenuItems);
          this.startV = 0;
          this.tranlateV = 0;
          this.$nextTick(() => {
            this.scrollEventV();
          });
          let listHeightV;
          if (flatClonedMenuItems[0].key !== 'NOT_FOUND')
            listHeightV = flatClonedMenuItems.length * this.lineHeight + 8 + 'px'; //行高：33，padding：8
          return { flatClonedMenuItems, menuProps, listHeightV };
        } else {
          return { menuProps, clonedMenuItems };
        }
      }
      return null;
    },
    realRenderMenu() {
      if (!this.renderMenu) return null;
      if (this.$props.virtual) {
        let { menuProps, listHeightV, flatClonedMenuItems } = this.renderMenu;
        let clonedMenuItems = flatClonedMenuItems.slice(
          Math.max(this.startV - this.preloadCount, 0),
          Math.min(this.endV + this.preloadCount, flatClonedMenuItems.length),
        );
        return (
          <div style={{ height: listHeightV }}>
            <Menu {...menuProps} style={{ transform: this.tranlateV, maxHeight: listHeightV }}>
              {clonedMenuItems}
            </Menu>
          </div>
        );
      } else {
        const { menuProps, clonedMenuItems } = this.renderMenu;
        return (
          <Menu {...menuProps} style={{ maxHeight: '250px' }}>
            {clonedMenuItems}
          </Menu>
        );
      }
    },
    visibleCountV() {
      return Math.ceil(this.height / this.lineHeight);
    },
    endV() {
      return this.startV + this.visibleCountV;
    },
    onScroll() {
      const { popupScroll } = getListeners(this);
      let onScroll;
      if (this.$props.virtual) {
        onScroll = e => {
          if (popupScroll) {
            popupScroll(e);
          }
          this.scrollEventV();
        };
      } else if (popupScroll) {
        onScroll = popupScroll;
      }
      return onScroll;
    },
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
  beforeDestroy() {
    if (this.rafInstance) {
      raf.cancel(this.rafInstance);
    }
  },
  methods: {
    scrollActiveItemToView() {
      // scroll into view
      const itemComponent = this.firstActiveItem && this.firstActiveItem.$el;
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
        scrollIntoView(itemComponent, this.$refs.menuRef.$el, scrollIntoViewOpts);
      });
    },
    scrollEventV() {
      let scrollTop = this.$refs.menuContainer.scrollTop;
      this.startV = Math.floor(scrollTop / this.lineHeight);
      scrollTop = Math.max(scrollTop - this.preloadCount * this.lineHeight, 0);
      const startOffsetV = scrollTop - (scrollTop % this.lineHeight);
      this.tranlateV = `translateY(${startOffsetV}px)`;
    },
    flattenNode(allNode) {
      const flatNode = [];
      const dig = (node, paddingLeft) => {
        node.forEach(it => {
          if (
            it.componentOptions &&
            it.componentOptions.children &&
            it.componentOptions.children.length
          ) {
            const item = cloneVNode(it);
            if (paddingLeft) item.data.style.paddingLeft = paddingLeft + 'px';
            flatNode.push(item);
            let marginLeftTotal = 20 + paddingLeft;
            dig(item.componentOptions.children, marginLeftTotal);
            if (item.tag.indexOf('MenuItemGroup') != -1) item.componentOptions.children = [];
          }
        });
      };
      dig(allNode, 0);
      return flatNode;
    },
  },
  render() {
    const renderMenu = this.realRenderMenu;
    let { popupFocus } = getListeners(this);
    return renderMenu ? (
      <div
        style={{
          overflow: 'auto',
          transform: 'translateZ(0)',
          maxHeight: this.$props.virtual && '250px',
        }}
        id={this.$props.ariaId}
        tabIndex="-1"
        onFocus={popupFocus}
        onMousedown={preventDefaultEvent}
        onScroll={this.onScroll}
        ref="menuContainer"
      >
        {renderMenu}
      </div>
    ) : null;
  },
};
