<script>
import PropTypes from '../../_util/vue-types'
import MenuMixin from './MenuMixin'
import BaseMixin from '../../_util/BaseMixin'
import hasProp from '../../_util/props-util'
import commonPropsType from './commonPropsType'

const Menu = {
  name: 'Menu',
  props: {
    ...commonPropsType,
    selectable: PropTypes.bool.def(true),
  },
  mixins: [BaseMixin, MenuMixin],

  data () {
    const props = this.$props
    let sSelectedKeys = props.defaultSelectedKeys
    let sOpenKeys = props.defaultOpenKeys
    if (hasProp(this, 'selectedKeys')) {
      sSelectedKeys = props.selectedKeys || []
    }
    if (hasProp(this, 'openKeys')) {
      sOpenKeys = props.openKeys || []
    }

    this.isRootMenu = true
    return {
      sSelectedKeys,
      sOpenKeys,
    }
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        if (hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys: nextProps.selectedKeys || [],
          })
        }
        if (hasProp(this, 'openKeys')) {
          this.setState({
            sOpenKeys: nextProps.openKeys || [],
          })
        }
      },
      deep: true,
    },
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
        let sSelectedKeys = this.$data.sSelectedKeys
        const selectedKey = selectInfo.key
        if (props.multiple) {
          sSelectedKeys = sSelectedKeys.concat([selectedKey])
        } else {
          sSelectedKeys = [selectedKey]
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys,
          })
        }
        this.__emit('select', {
          ...selectInfo,
          selectedKeys: sSelectedKeys,
        })
      }
    },

    onClick (e) {
      this.__emit('click', e)
    },

    onOpenChange (event) {
      const sOpenKeys = this.$data.sOpenKeys.concat()
      let changed = false
      const processSingle = (e) => {
        let oneChanged = false
        if (e.open) {
          oneChanged = sOpenKeys.indexOf(e.key) === -1
          if (oneChanged) {
            sOpenKeys.push(e.key)
          }
        } else {
          const index = sOpenKeys.indexOf(e.key)
          oneChanged = index !== -1
          if (oneChanged) {
            sOpenKeys.splice(index, 1)
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
          this.setState({ sOpenKeys })
        }
        this.__emit('openChange', sOpenKeys)
      }
    },

    onDeselect (selectInfo) {
      const props = this.$props
      if (props.selectable) {
        const sSelectedKeys = this.$data.sSelectedKeys.concat()
        const selectedKey = selectInfo.key
        const index = sSelectedKeys.indexOf(selectedKey)
        if (index !== -1) {
          sSelectedKeys.splice(index, 1)
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys,
          })
        }
        this.__emit('deselect', {
          ...selectInfo,
          selectedKeys: sSelectedKeys,
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

    isInlineMode () {
      return this.$props.mode === 'inline'
    },

    lastOpenSubMenu () {
      let lastOpen = []
      const { sOpenKeys } = this.$data
      if (sOpenKeys.length) {
        lastOpen = this.getFlatInstanceArray().filter((c) => {
          return c && sOpenKeys.indexOf(c.eventKey) !== -1
        })
      }
      return lastOpen[0]
    },

    renderMenuItem (c, i, subIndex) {
      if (!c) {
        return null
      }
      const state = this.$data
      const extraProps = {
        openKeys: state.sOpenKeys,
        selectedKeys: state.sSelectedKeys,
        triggerSubMenuAction: this.$props.triggerSubMenuAction,
        isRootMenu: true,
      }
      return this.renderCommonMenuItem(c, i, subIndex, extraProps)
    },
  },

  render () {
    const props = { ...this.$props }
    props.class = ` ${props.prefixCls}-root`
    return this.renderRoot(props, this.$slots.default)
  },
}
export default Menu
</script>
