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
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: {
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    tabBarPosition: {
      default: 'top',
      validator (value) {
        return ['top', 'bottom', 'left', 'right'].includes(value)
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
      console.log('onTabClick', activeKey)
      // if (this.tabBar.props.onTabClick) {
      //   this.tabBar.props.onTabClick(activeKey)
      // }
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
        // this.stateActiveKey = activeKey
        this.$emit('change', activeKey)
      }
    },

    getNextActiveKey (next) {
      const activeKey = this.stateActiveKey
      const children = []
      this.$slots.default.forEach(({ componentOptions = {}}) => {
        const c = componentOptions.propsData
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
            ret = children[0].pKey
          } else {
            ret = children[i + 1].pKey
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
    const panels = []
    if (hasSlot) {
      $slots.default.forEach(tab => {
        tab.componentOptions && panels.push(tab.componentOptions.propsData)
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
      },
    }
    const tabBarProps = {
      props: {
        panels: panels,
        prefixCls: prefixCls,
        onKeyDown: onNavKeyDown,
        tabBarPosition: tabBarPosition,
        onTabClick: onTabClick,
        activeKey: stateActiveKey,
        key: 'tabBar',
      },
    }
    const contents = [
      <TabBar {...tabBarProps}>
        {this.$slots.tabBarExtraContent}
      </TabBar>,
      <TabContent {...tabContentProps}>
        {$slots.default}
      </TabContent>,
    ]
    if (tabBarPosition === 'bottom') {
      contents.reverse()
    }
    return (
      <div
        class={classes}
      >
        {contents}
      </div>
    )
  },
}
</script>
