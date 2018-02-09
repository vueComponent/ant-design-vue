<script>
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
        this.lastVisible = false
      }
    },
  },

  // shouldComponentUpdate (nextProps) {
  //   if (!nextProps.visible) {
  //     this.lastVisible = false
  //   }
  //   // freeze when hide
  //   return nextProps.visible
  // }

  updated () {
    const props = this.$props
    if (!this.prevVisible && props.visible) {
      this.$nextTick(() => {
        this.scrollActiveItemToView()
      })
    }
    this.lastVisible = props.visible
    this.lastInputValue = props.inputValue
  },
  methods: {
    scrollActiveItemToView () {
    // scroll into view
      const itemComponent = this.$refs.firstActiveItem && this.$refs.firstActiveItem.$el
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

        scrollIntoView(
          itemComponent,
          this.$refs.menuRef.$el,
          scrollIntoViewOpts
        )
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
      } = props
      const { menuDeselect, menuSelect } = this.$listeners
      if (menuItems && menuItems.length) {
        const selectedKeys = getSelectKeys(menuItems, value)
        const menuProps = {
          props: {
            multiple,
            defaultActiveFirst: defaultActiveFirstOption,
            focusable: false,
            selectedKeys,
            prefixCls: `${prefixCls}-menu`,
          },
          on: {},
          style: dropdownMenuStyle,
          ref: 'menuRef',
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
            activeKeyProps.activeKey = selectedKeys[0] || firstActiveValue
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
                ref: 'firstActiveItem',
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
        }

        // clear activeKey when inputValue change
        const lastValue = value && value[value.length - 1]
        if (inputValue !== this.lastInputValue && (!lastValue || !lastValue.backfill)) {
          activeKeyProps.activeKey = ''
        }
        menuProps.props = { ...menuProps.props, ...activeKeyProps }
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
    this.prevVisible = this.visible
    const { popupFocus, popupScroll } = this.$listeners
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={popupFocus}
        onMousedown={preventDefaultEvent}
        onScroll={popupScroll}
      >
        {renderMenu}
      </div>
    ) : null
  },
}

</script>
