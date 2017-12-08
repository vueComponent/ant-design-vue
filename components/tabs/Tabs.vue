<script>
import Icon from '../icon'
import KeyCode from './KeyCode'
import TabContent from './TabContent'
import ScrollableInkTabBar from './ScrollableInkTabBar'
function getDefaultActiveKey (t) {
  let activeKey
  t.$slots.default && t.$slots.default.forEach(({ componentOptions = {}}) => {
    const child = componentOptions.propsData
    if (child && !activeKey && !child.disabled) {
      activeKey = child.tabKey
    }
  })
  return activeKey
}
function activeKeyIsValid (t, key) {
  const keys = t.$slots.default && t.$slots.default.map(({ componentOptions = {}}) => {
    const child = componentOptions.propsData
    if (child) {
      return child.tabKey
    }
  })
  return key !== undefined && keys.indexOf(key) >= 0
}
function noop () {
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
    tabBarProps: Object,
    tabContentProps: Object,
    destroyInactiveTabPane: Boolean,
    activeKey: String,
    defaultActiveKey: String,
    type: {
      validator (value) {
        return ['line', 'card', 'editable-card'].includes(value)
      },
    },
    onChange: { type: Function, default: noop },
    onTabClick: { type: Function, default: noop },
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
    if (this.activeKey) {
      this.stateActiveKey = this.activeKey
    } else if (!activeKeyIsValid(this, this.stateActiveKey)) {
      this.stateActiveKey = getDefaultActiveKey(this)
    }
  },
  methods: {
    getStateActiveKey () {
      let activeKey
      if (this.activeKey) {
        activeKey = this.activeKey
      } else if (this.defaultActiveKey) {
        activeKey = this.defaultActiveKey
      } else {
        activeKey = getDefaultActiveKey(this)
      }
      return activeKey
    },
    handleTabClick (activeKey) {
      this.onTabClick(activeKey)
      this.setActiveKey(activeKey)
    },

    onNavKeyDown (e) {
      const eventKeyCode = e.keyCode
      if (eventKeyCode === KeyCode.RIGHT || eventKeyCode === KeyCode.DOWN) {
        e.preventDefault()
        const nextKey = this.getNextActiveKey(true)
        this.handleTabClick(nextKey)
      } else if (eventKeyCode === KeyCode.LEFT || eventKeyCode === KeyCode.UP) {
        e.preventDefault()
        const previousKey = this.getNextActiveKey(false)
        this.handleTabClick(previousKey)
      }
    },

    setActiveKey (activeKey) {
      if (this.stateActiveKey !== activeKey) {
        if (!this.activeKey) {
          this.stateActiveKey = activeKey
        }
        this.onChange(activeKey)
      }
    },

    getNextActiveKey (next) {
      const activeKey = this.stateActiveKey
      const children = []
      this.$slots.default && this.$slots.default.forEach(({ componentOptions = {}}) => {
        const c = componentOptions.propsData
        if (c && !c.disabled && c.disabled !== '') {
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
        if (child.tabKey === activeKey) {
          if (i === length - 1) {
            ret = children[0].tabKey
          } else {
            ret = children[i + 1].tabKey
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
      handleTabClick,
      stateActiveKey,
      classes,
      setActiveKey,
      $slots,
    } = this
    const panels = []

    $slots.default && $slots.default.forEach(tab => {
      tab.componentOptions && panels.push(tab.componentOptions.propsData)
    })
    const tabContentProps = {
      props: {
        ...this.tabContentProps,
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
        ...this.tabBarProps,
        panels: panels,
        prefixCls: prefixCls,
        onKeyDown: onNavKeyDown,
        tabBarPosition: tabBarPosition,
        onTabClick: handleTabClick,
        activeKey: stateActiveKey,
        key: 'tabBar',
      },
      style: this.tabBarProps.style || {},
    }
    const contents = [
      <ScrollableInkTabBar {...tabBarProps}>
        {$slots.tabBarExtraContent ? <span slot='extraContent'>
          {$slots.tabBarExtraContent}
        </span> : null}
      </ScrollableInkTabBar>,
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
