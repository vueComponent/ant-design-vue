<script>
import PropTypes from '../_util/vue-types'
import toArray from 'rc-util/lib/Children/toArray'
import Menu from '../vc-menu'
import scrollIntoView from 'dom-scroll-into-view'
import { getSelectKeys, preventDefaultEvent, saveRef } from './util'

export default {
  props: {
    defaultActiveFirstOption: PropTypes.bool,
    value: PropTypes.any,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    onPopupFocus: PropTypes.func,
    onPopupScroll: PropTypes.func,
    onMenuDeSelect: PropTypes.func,
    onMenuSelect: PropTypes.func,
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
    const prevProps = this.prevProps
    const props = this.$props
    if (!prevProps.visible && props.visible) {
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
      const itemComponent = this.$refs.firstActiveItem.$el
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
      const props = this.props
      const {
        menuItems,
        defaultActiveFirstOption,
        value,
        prefixCls,
        multiple,
        onMenuSelect,
        inputValue,
        firstActiveValue,
      } = props
      if (menuItems && menuItems.length) {
        const menuProps = {}
        if (multiple) {
          menuProps.onDeselect = props.onMenuDeselect
          menuProps.onSelect = onMenuSelect
        } else {
          menuProps.onClick = onMenuSelect
        }

        const selectedKeys = getSelectKeys(menuItems, value)
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
                ref: ref => {
                  this.firstActiveItem = ref
                },
              })
            }
            return item
          }

          clonedMenuItems = menuItems.map(item => {
            if (item.type.isMenuItemGroup) {
              const children = toArray(item.props.children).map(clone)
              return cloneElement(item, {}, children)
            }
            return clone(item)
          })
        }

        // clear activeKey when inputValue change
        const lastValue = value && value[value.length - 1]
        if (inputValue !== this.lastInputValue && (!lastValue || !lastValue.backfill)) {
          activeKeyProps.activeKey = ''
        }

        return (
          <Menu
            ref={saveRef(this, 'menuRef')}
            style={this.props.dropdownMenuStyle}
            defaultActiveFirst={defaultActiveFirstOption}
            {...activeKeyProps}
            multiple={multiple}
            focusable={false}
            {...menuProps}
            selectedKeys={selectedKeys}
            prefixCls={`${prefixCls}-menu`}
          >
            {clonedMenuItems}
          </Menu>
        )
      }
      return null
    },
  },
  render () {
    const renderMenu = this.renderMenu()
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={this.props.onPopupFocus}
        onMouseDown={preventDefaultEvent}
        onScroll={this.props.onPopupScroll}
      >
        {renderMenu}
      </div>
    ) : null
  },
}

DropdownMenu.displayName = 'DropdownMenu'

</script>
