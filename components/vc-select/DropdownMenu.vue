<script>
import PropTypes from '../_util/vue-types'
import toArray from 'rc-util/lib/Children/toArray'
import Menu from '../vc-menu'
import scrollIntoView from 'dom-scroll-into-view'
import { getSelectKeys, preventDefaultEvent } from './util'
import { cloneElement } from '../_util/vnode'
import BaseMixin from '../_util/BaseMixin'

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
          menuProps.on.deselect = this.onMenuDeselect
          menuProps.on.select = this.onMenuSelect
        } else {
          menuProps.on.click = this.onMenuSelect
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
        menuProps.props = { ...menuProps.props, ...activeKeyProps }
        return (
          <Menu {...menuProps}>
            {clonedMenuItems}
          </Menu>
        )
      }
      return null
    },
    onPopupFocus (e) {
      this.__emit('popupFocus', e)
    },
    onPopupScroll (e) {
      this.__emit('popupScroll', e)
    },
    onMenuDeselect () {
      this.__emit('menuDeselect', ...arguments)
    },
    onMenuSelect () {
      this.__emit('menuSelect', ...arguments)
    },
  },
  render () {
    const renderMenu = this.renderMenu()
    return renderMenu ? (
      <div
        style={{ overflow: 'auto' }}
        onFocus={this.onPopupFocus}
        onMousedown={preventDefaultEvent}
        onScroll={this.onPopupScroll}
      >
        {renderMenu}
      </div>
    ) : null
  },
}

</script>
