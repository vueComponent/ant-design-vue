
// based on rc-tabs 9.2.4 e16ee09531476757b18b7bc0ec1daddcc0d40d65
import Icon from '../../icon'
import KeyCode from './KeyCode'
import TabContent from './TabContent'
import ScrollableInkTabBar from './ScrollableInkTabBar'
import hasProp from '../../_util/props-util'
import BaseMixin from '../../_util/BaseMixin'
function getDefaultActiveKey (t) {
  let activeKey
  t.$slots.default && t.$slots.default.forEach(({ componentOptions = {}, key: tabKey }) => {
    const child = componentOptions.propsData
    if (child && !activeKey && !child.disabled) {
      activeKey = tabKey
    }
  })
  return activeKey
}
function activeKeyIsValid (t, key) {
  const keys = t.$slots.default && t.$slots.default.map(({ componentOptions = {}, key: tabKey }) => {
    const child = componentOptions.propsData
    if (child) {
      return tabKey
    }
  })
  return key !== undefined && keys.indexOf(key) >= 0
}

export default {
  name: 'Tabs',
  components: { Icon },
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  mixins: [BaseMixin],
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
    handleTabClick (activeKey,e) {
      this.__emit('tabClick', activeKey, e)
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
        if (!hasProp(this, 'activeKey')) {
          this.stateActiveKey = activeKey
        }
        this.__emit('change', activeKey)
      }
    },

    getNextActiveKey (next) {
      const activeKey = this.stateActiveKey
      const children = []
      this.$slots.default && this.$slots.default.forEach(({ componentOptions = {}, key: tabKey }) => {
        const c = componentOptions.propsData

        if (c && !c.disabled && c.disabled !== '') {
          if (next) {
            children.push({ ...c, tabKey })
          } else {
            children.unshift({ ...c, tabKey })
          }
        }
      })
      const length = children.length
      let ret = length && children[0].tabKey
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

    $slots.default && $slots.default.forEach(({ componentOptions, key: tabKey }) => {
      if (componentOptions) {
        if (componentOptions.propsData.tab === undefined) {
          const tab = (componentOptions.children || []).filter(({ data = {}}) => data.slot === 'tab')
          componentOptions.propsData.tab = tab
        }
        panels.push({ ...componentOptions.propsData, tabKey })
      }
    })
    const tabContentProps = {
      props: {
        ...this.tabContentProps.props,
        prefixCls,
        tabBarPosition,
        activeKey: stateActiveKey,
        destroyInactiveTabPane,
        // onChange: setActiveKey,
      },
      on: {
        change: setActiveKey,
      },
    }
    const tabBarProps = {
      props: {
        ...this.tabBarProps.props,
        panels: panels,
        prefixCls: prefixCls,
        tabBarPosition: tabBarPosition,
        activeKey: stateActiveKey,
      },
      style: this.tabBarProps.style || {},
      on: {
        ...this.tabBarProps.on,
        keydown: onNavKeyDown,
        tabClick: handleTabClick,
      },
    }
    const contents = [
      <ScrollableInkTabBar
        {...tabBarProps}
        key='tabBar'
      >
        {$slots.tabBarExtraContent ? <template slot='extraContent'>
          {$slots.tabBarExtraContent}
        </template> : null}
      </ScrollableInkTabBar>,
      <TabContent
        {...tabContentProps}
        key='tabContent'
      >
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

