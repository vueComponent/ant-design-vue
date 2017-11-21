<script>
import Icon from '../icon'
import KeyCode from './KeyCode'
import TabBar from './TabBar'
import TabContent from './TabContent'
function getDefaultActiveKey (t) {
  let activeKey
  t.$slot.default.forEach((child) => {
    if (child && !activeKey && !child.disabled) {
      activeKey = child.pKey
    }
  })
  return activeKey
}
function activeKeyIsValid (t, key) {
  const keys = t.$slot.default.map(child => child && child.pKey)
  return keys.indexOf(key) >= 0
}
export default {
  name: 'Tabs',
  components: { Icon },
  props: {
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    tabBarPosition: {
      default: 'top',
      validator (value) {
        return ['top', 'bottom'].includes(value)
      },
    },
    destroyInactiveTabPane: Boolean,
    activeKey: String,
    defaultActiveKey: String,
  },
  data () {
    return {
      stateActiveKey: this.getStateActiveKey(),
    }
  },
  computed: {
    classes () {
      const { prefixCls, tabBarPosition } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${tabBarPosition}`]: true,
      }
    },
  },
  beforeUpdate () {
    if ('activeKey' in this) {
      this.stateActiveKey = this.activeKey
    } else if (!activeKeyIsValid(this, this.stateActiveKey)) {
      this.stateActiveKey = getDefaultActiveKey(this)
    }
  },
  methods: {
    getStateActiveKey () {
      let activeKey
      if ('activeKey' in this) {
        activeKey = this.activeKey
      } else if ('defaultActiveKey' in this) {
        activeKey = this.defaultActiveKey
      } else {
        activeKey = getDefaultActiveKey(this)
      }
      return activeKey
    },
    onTabClick (activeKey) {
      if (this.tabBar.props.onTabClick) {
        this.tabBar.props.onTabClick(activeKey)
      }
      this.setActiveKey(activeKey)
    },

    onNavKeyDown (e) {
      const eventKeyCode = e.keyCode
      if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
        e.preventDefault()
        const nextKey = this.getNextActiveKey(true)
        this.onTabClick(nextKey)
      } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
        e.preventDefault()
        const previousKey = this.getNextActiveKey(false)
        this.onTabClick(previousKey)
      }
    },

    setActiveKey (activeKey) {
      if (this.stateActiveKey !== activeKey) {
        if (!('activeKey' in this)) {
          this.stateActiveKey = activeKey
        }
        this.$emit('change', activeKey)
      }
    },

    getNextActiveKey (next) {
      const activeKey = this.stateActiveKey
      const children = []
      this.$slot.default.forEach((c) => {
        if (c && !c.disabled) {
          if (next) {
            children.push(c)
          } else {
            children.unshift(c)
          }
        }
      })
      const length = children.length
      let ret = length && children[0].key
      children.forEach((child, i) => {
        if (child.pKey === activeKey) {
          if (i === length - 1) {
            ret = children[0].key
          } else {
            ret = children[i + 1].key
          }
        }
      })
      return ret
    },
  },
  beforeDestroy () {
  },
  render () {
    const {
      prefixCls,
      tabBarPosition,
      destroyInactiveTabPane,
      onNavKeyDown,
      onTabClick,
      stateActiveKey,
      classes,
      setActiveKey,
      $slots,
    } = this
    const hasSlot = !!$slots.default
    const tabBarProps = []
    if (hasSlot) {
      $slots.default.forEach(tab => {
        tab.data && tabBarProps.push(
          <TabBar
            {...tab.data}
            prefixCls={prefixCls}
            onKeyDown={onNavKeyDown}
            tabBarPosition={tabBarPosition}
            onTabClick={onTabClick}
            activeKey={stateActiveKey} />)
      })
    }
    const tabContentProps = {
      props: {
        prefixCls,
        tabBarPosition,
        activeKey: stateActiveKey,
        destroyInactiveTabPane,
        onChange: setActiveKey,
        key: 'tabContent',
      }}
    return (
      <div
        class={classes}
      >
        {tabBarProps}
        <TabContent {...tabContentProps}>
          {$slots.default}
        </TabContent>
      </div>
    )
  },
}
</script>
