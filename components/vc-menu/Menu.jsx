import PropTypes from '../_util/vue-types'
import { Provider, create } from '../_util/store'
import { default as SubPopupMenu, getActiveKey } from './SubPopupMenu'
import BaseMixin from '../_util/BaseMixin'
import hasProp, { getOptionProps } from '../_util/props-util'
import commonPropsType from './commonPropsType'

const Menu = {
  name: 'Menu',
  props: {
    ...commonPropsType,
    selectable: PropTypes.bool.def(true),
  },
  mixins: [BaseMixin],

  data () {
    const props = getOptionProps(this)
    let selectedKeys = props.defaultSelectedKeys
    let openKeys = props.defaultOpenKeys
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || []
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || []
    }

    this.store = create({
      selectedKeys,
      openKeys,
      activeKey: { '0-menu-': getActiveKey({ ...props, children: this.$slots.default || [] }, props.activeKey) },
    })

    // this.isRootMenu = true // 声明在props上
    return {}
  },
  watch: {
    selectedKeys (val) {
      this.store.setState({
        selectedKeys: val || [],
      })
    },
    openKeys (val) {
      this.store.setState({
        openKeys: val || [],
      })
    },
    // '$props': {
    //   handler: function (nextProps) {
    //     if (hasProp(this, 'selectedKeys')) {
    //       this.setState({
    //         sSelectedKeys: nextProps.selectedKeys || [],
    //       })
    //     }
    //     if (hasProp(this, 'openKeys')) {
    //       this.setState({
    //         sOpenKeys: nextProps.openKeys || [],
    //       })
    //     }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    // onDestroy (key) {
    //   const state = this.$data
    //   const sSelectedKeys = state.sSelectedKeys
    //   const sOpenKeys = state.sOpenKeys
    //   let index = sSelectedKeys.indexOf(key)
    //   if (!hasProp(this, 'selectedKeys') && index !== -1) {
    //     sSelectedKeys.splice(index, 1)
    //   }
    //   index = sOpenKeys.indexOf(key)
    //   if (!hasProp(this, 'openKeys') && index !== -1) {
    //     sOpenKeys.splice(index, 1)
    //   }
    // },

    onSelect (selectInfo) {
      const props = this.$props
      if (props.selectable) {
      // root menu
        let selectedKeys = this.store.getState().selectedKeys
        const selectedKey = selectInfo.key
        if (props.multiple) {
          selectedKeys = selectedKeys.concat([selectedKey])
        } else {
          selectedKeys = [selectedKey]
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys,
          })
        }
        this.__emit('select', {
          ...selectInfo,
          selectedKeys: selectedKeys,
        })
      }
    },

    onClick (e) {
      this.__emit('click', e)
    },
    // onKeyDown needs to be exposed as a instance method
    // e.g., in rc-select, we need to navigate menu item while
    // current active item is rc-select input box rather than the menu itself
    onKeyDown (e, callback) {
      this.$refs.innerMenu.getWrappedInstance().onKeyDown(e, callback)
    },
    onOpenChange (event) {
      const openKeys = this.store.getState().openKeys.concat()
      let changed = false
      const processSingle = (e) => {
        let oneChanged = false
        if (e.open) {
          oneChanged = openKeys.indexOf(e.key) === -1
          if (oneChanged) {
            openKeys.push(e.key)
          }
        } else {
          const index = openKeys.indexOf(e.key)
          oneChanged = index !== -1
          if (oneChanged) {
            openKeys.splice(index, 1)
          }
        }
        changed = changed || oneChanged
      }
      if (Array.isArray(event)) {
      // batch change call
        event.forEach(processSingle)
      } else {
        processSingle(event)
      }
      if (changed) {
        if (!hasProp(this, 'openKeys')) {
          this.store.setState({ openKeys })
        }
        this.__emit('openChange', openKeys)
      }
    },

    onDeselect (selectInfo) {
      const props = this.$props
      if (props.selectable) {
        const selectedKeys = this.store.getState().selectedKeys.concat()
        const selectedKey = selectInfo.key
        const index = selectedKeys.indexOf(selectedKey)
        if (index !== -1) {
          selectedKeys.splice(index, 1)
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.store.setState({
            selectedKeys,
          })
        }
        this.__emit('deselect', {
          ...selectInfo,
          selectedKeys: selectedKeys,
        })
      }
    },

    getOpenTransitionName () {
      const props = this.$props
      let transitionName = props.openTransitionName
      const animationName = props.openAnimation
      if (!transitionName && typeof animationName === 'string') {
        transitionName = `${props.prefixCls}-open-${animationName}`
      }
      return transitionName
    },

  //   isInlineMode () {
  //     return this.$props.mode === 'inline'
  //   },

  //   lastOpenSubMenu () {
  //     let lastOpen = []
  //     const { sOpenKeys } = this.$data
  //     if (sOpenKeys.length) {
  //       lastOpen = this.getFlatInstanceArray().filter((c) => {
  //         return c && sOpenKeys.indexOf(c.eventKey) !== -1
  //       })
  //     }
  //     return lastOpen[0]
  //   },

  //   renderMenuItem (c, i, subIndex) {
  //     if (!c) {
  //       return null
  //     }
  //     const state = this.$data
  //     const extraProps = {
  //       openKeys: state.sOpenKeys,
  //       selectedKeys: state.sSelectedKeys,
  //       triggerSubMenuAction: this.$props.triggerSubMenuAction,
  //       isRootMenu: this.isRootMenu,
  //     }
  //     return this.renderCommonMenuItem(c, i, subIndex, extraProps)
  //   },
  },

  render () {
    const props = getOptionProps(this)
    const subPopupMenuProps = {
      props: {
        ...props,
        openTransitionName: this.getOpenTransitionName(),
        parentMenu: this,
        children: this.$slots.default || [],
        __propsSymbol__: Symbol(),
      },
      class: `${props.prefixCls}-root`,
      on: {
        click: this.onClick,
        openChange: this.onOpenChange,
        deselect: this.onDeselect,
        select: this.onSelect,
      },
      ref: 'innerMenu',
    }
    return (
      <Provider store={this.store}>
        <SubPopupMenu {...subPopupMenuProps} />
      </Provider>
    )
  },
}
export default Menu

