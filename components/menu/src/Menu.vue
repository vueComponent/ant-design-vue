<script>
import PropTypes from '../../_util/vue-types'
import MenuMixin from './MenuMixin'
import StateMixin from '../../_util/StateMixin'

const Menu = {
  name: 'Menu',
  props: {
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string).def([]),
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string).def([]),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']).def('vertical'),
    getPopupContainer: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subMenuOpenDelay: PropTypes.number.def(0),
    subMenuCloseDelay: PropTypes.number.def(0.1),
    forceSubMenuRender: PropTypes.bool,
    triggerSubMenuAction: PropTypes.string.def('hover'),
    level: PropTypes.number.def(1),
    selectable: PropTypes.bool.def(true),
    multiple: PropTypes.bool,
    children: PropTypes.any,
  },
  mixins: [StateMixin, MenuMixin],

  data () {
    const props = this.$props
    let selectedKeys = props.defaultSelectedKeys
    let openKeys = props.defaultOpenKeys
    selectedKeys = props.selectedKeys || []
    openKeys = props.openKeys || []
    this.isRootMenu = true
    return {
      selectedKeys,
      openKeys,
    }
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        const props = {}
        if (nextProps.selectedKeys === undefined) {
          props.selectedKeys = nextProps.selectedKeys || []
        }
        if (nextProps.openKeys === undefined) {
          props.openKeys = nextProps.openKeys || []
        }
        this.setState(props)
      },
      deep: true,
    },
  },
  methods: {
    onDestroy (key) {
      const state = this.$data
      const props = this.$props
      const selectedKeys = state.selectedKeys
      const openKeys = state.openKeys
      let index = selectedKeys.indexOf(key)
      if (!('selectedKeys' in props) && index !== -1) {
        selectedKeys.splice(index, 1)
      }
      index = openKeys.indexOf(key)
      if (!('openKeys' in props) && index !== -1) {
        openKeys.splice(index, 1)
      }
    },

    onSelect (selectInfo) {
      const props = this.$props
      if (props.selectable) {
      // root menu
        let selectedKeys = this.$data.selectedKeys
        const selectedKey = selectInfo.key
        if (props.multiple) {
          selectedKeys = selectedKeys.concat([selectedKey])
        } else {
          selectedKeys = [selectedKey]
        }
        if (!('selectedKeys' in props)) {
          this.setState({
            selectedKeys,
          })
        }
        this.$emit('select', {
          ...selectInfo,
          selectedKeys,
        })
      }
    },

    onClick (e) {
      this.$emit('click', e)
    },

    onOpenChange (e_) {
      const openKeys = this.$data.openKeys.concat()
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
      if (Array.isArray(e_)) {
      // batch change call
        e_.forEach(processSingle)
      } else {
        processSingle(e_)
      }
      if (changed) {
        if (this.$props.openKeys === undefined) {
          this.setState({ openKeys })
        }
        this.$emit('openChange', openKeys)
      }
    },

    onDeselect (selectInfo) {
      const props = this.$props
      if (props.selectable) {
        const selectedKeys = this.$data.selectedKeys.concat()
        const selectedKey = selectInfo.key
        const index = selectedKeys.indexOf(selectedKey)
        if (index !== -1) {
          selectedKeys.splice(index, 1)
        }
        if (!('selectedKeys' in props)) {
          this.setState({
            selectedKeys,
          })
        }
        this.$emit('deselect', {
          ...selectInfo,
          selectedKeys,
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
      const { openKeys } = this.$data
      if (openKeys.length) {
        lastOpen = this.getFlatInstanceArray().filter((c) => {
          return c && openKeys.indexOf(c.props.eventKey) !== -1
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
        openKeys: state.openKeys,
        selectedKeys: state.selectedKeys,
        triggerSubMenuAction: this.$props.triggerSubMenuAction,
      }
      return this.renderCommonMenuItem(c, i, subIndex, extraProps)
    },
  },

  render () {
    const props = { ...this.$props }
    props.className += ` ${props.prefixCls}-root`
    return this.renderRoot(props)
  },
}
export default Menu
</script>
