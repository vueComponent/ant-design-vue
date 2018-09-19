import raf from 'raf'
import PropTypes from '../_util/vue-types'
import Menu from '../vc-menu'
import scrollIntoView from 'dom-scroll-into-view'
import { getSelectKeys, preventDefaultEvent } from './util'
import { cloneElement } from '../_util/vnode'
import BaseMixin from '../_util/BaseMixin'
import { getSlotOptions } from '../_util/props-util'

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
    visible: PropTypes.bool,
    backfillValue: PropTypes.any,
  },

  beforeMount () {
    this.lastInputValue = this.$props.inputValue
  },

  mounted () {
    this.$nextTick(() => {
      this.scrollActiveItemToView()
    })
    this.lastVisible = this.$props.visible
  },
  watch: {
    visible (val) {
      if (!val) {
        this.lastVisible = val
      }
    },
  },
  updated () {
    const props = this.$props
    if (!this.prevVisible && props.visible) {
      this.$nextTick(() => {
        this.scrollActiveItemToView()
      })
    }
    this.lastVisible = props.visible
    this.lastInputValue = props.inputValue
    this.prevVisible = this.visible
  },
  methods: {
    scrollActiveItemToView () {
    // scroll into view
      const itemComponent = this.firstActiveItem && this.firstActiveItem.$el
      const props = this.$props

      if (itemComponent) {
        const scrollIntoViewOpts = {
          onlyScrollIfNeeded: true,
        }
        if (
          (!props.value || props.value.length === 0) &&
        props.firstActiveValue
        ) {
          scrollIntoViewOpts.alignWithTop = true
        }
        // Delay to scroll since current frame item position is not ready when pre view is by filter
        // https://github.com/ant-design/ant-design/issues/11268#issuecomment-406634462
        raf(() => {
          scrollIntoView(
            itemComponent,
            this.$refs.menuRef.$el,
            scrollIntoViewOpts
          )
        })
      }
    },

    renderMenu () {
      const props = this.$props
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
      } = props
      const { menuDeselect, menuSelect, popupScroll } = this.$listeners
      if (menuItems && menuItems.length) {
        const selectedKeys = getSelectKeys(menuItems, value)
        const menuProps = {
          props: {
            multiple,
            defaultActiveFirst: defaultActiveFirstOption,
            selectedKeys,
            prefixCls: `${prefixCls}-menu`,
          },
          on: {},
          style: dropdownMenuStyle,
          ref: 'menuRef',
          attrs: {
            role: 'listbox',
          },
        }
        if (popupScroll) {
          menuProps.on.scroll = popupScroll
        }
        if (multiple) {
          menuProps.on.deselect = menuDeselect
          menuProps.on.select = menuSelect
        } else {
          menuProps.on.click = menuSelect
        }
        const activeKeyProps = {}

        let clonedMenuItems = menuItems
        if (selectedKeys.length || firstActiveValue) {
          if (props.visible && !this.lastVisible) {
            activeKeyProps.activeKey = selectedKeys[0] !== undefined ? selectedKeys[0] : firstActiveValue
          }
          let foundFirst = false
          // set firstActiveItem via cloning menus
          // for scroll into view
          const clone = item => {
            if (
              (!foundFirst && selectedKeys.indexOf(item.key) !== -1) ||
            (!foundFirst &&
              !selectedKeys.length &&
              firstActiveValue.indexOf(item.key) !== -1)
            ) {
              foundFirst = true
              return cloneElement(item, {
                directives: [{
                  name: 'ref',
                  value: ref => {
                    this.firstActiveItem = ref
                  },
                }],
              })
            }
            return item
          }

          clonedMenuItems = menuItems.map(item => {
            if (getSlotOptions(item).isMenuItemGroup) {
              const children = item.componentOptions.children.map(clone)
              return cloneElement(item, { children })
            }
            return clone(item)
          })
        } else {
          // Clear firstActiveItem when dropdown menu items was empty
          // Avoid `Unable to find node on an unmounted component`
          // https://github.com/ant-design/ant-design/issues/10774
          this.firstActiveItem = null
        }

        // clear activeKey when inputValue change
        const lastValue = value && value[value.length - 1]
        if (inputValue !== this.lastInputValue && (!lastValue || lastValue !== backfillValue)) {
          activeKeyProps.activeKey = ''
        }
        menuProps.props = { ...activeKeyProps, ...menuProps.props }
        return (
          <Menu {...menuProps}>
            {clonedMenuItems}
          </Menu>
        )
      }
      return null
    },
  },
  render () {
    const renderMenu = this.renderMenu()
    const { popupFocus, popupScroll } = this.$listeners
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={popupFocus}
        onMousedown={preventDefaultEvent}
        onScroll={popupScroll}
        ref='menuContainer'
      >
        {renderMenu}
      </div>
    ) : null
  },
}

