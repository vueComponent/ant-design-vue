<script>
import Tabs from './Tabs'
import isFlexSupported from '../_util/isFlexSupported'
export default {
  props: {
    prefixCls: { type: String, default: 'ant-tabs' },
    activeKey: String,
    defaultActiveKey: String,
    hideAdd: { type: Boolean, default: false },
    tabBarStyle: Object,
    tabBarExtraContent: [String, Number, Function],
    destroyInactiveTabPane: { type: Boolean, default: false },
    type: {
      validator (value) {
        return ['line', 'card', 'editable-card'].includes(value)
      },
    },
    tabPosition: {
      validator (value) {
        return ['top', 'right', 'bottom', 'left'].includes(value)
      },
    },
    size: {
      validator (value) {
        return ['default', 'small'].includes(value)
      },
    },
    animated: { type: [Boolean, Object], default: undefined },
  },
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  methods: {
    createNewTab (targetKey) {
      this.$emit('edit', targetKey, 'add')
    },

    removeTab (targetKey, e) {
      e.stopPropagation()
      if (!targetKey) {
        return
      }
      this.$emit('edit', targetKey, 'remove')
    },

    handleChange (activeKey) {
      this.$emit('change', activeKey)
    },
    onTabClick (val) {
      this.$emit('tabClick', val)
    },
    onPrevClick (val) {
      this.$emit('prevClick', val)
    },
    onNextClick (val) {
      this.$emit('nextClick', val)
    },
  },

  mounted () {
    const NO_FLEX = ' no-flex'
    const tabNode = this.$el
    if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX
    }
  },

  render (createElement) {
    const {
      prefixCls,
      size,
      type = 'line',
      tabPosition,
      tabBarStyle,
      hideAdd,
      onTabClick,
      onPrevClick,
      onNextClick,
      animated,
      destroyInactiveTabPane = false,
      activeKey,
      defaultActiveKey,
    } = this
    const { tabBarExtraContent } = this.$props
    let { inkBarAnimated, tabPaneAnimated } = typeof animated === 'object' ? { // eslint-disable-line
      inkBarAnimated: !!animated.inkBar, tabPaneAnimated: !!animated.tabPane,
    } : {
      inkBarAnimated: animated === undefined || animated, tabPaneAnimated: animated === undefined || animated,
    }

    // card tabs should not have animation
    if (type !== 'line') {
      tabPaneAnimated = animated === undefined ? false : tabPaneAnimated
    }
    const cls = {
      [`${prefixCls}-mini`]: size === 'small' || size,
      [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
      [`${prefixCls}-card`]: type.indexOf('card') >= 0,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-no-animation`]: !tabPaneAnimated,
    }

    const tabBarProps = {
      inkBarAnimated,
      extraContent: tabBarExtraContent,
      onTabClick,
      onPrevClick,
      onNextClick,
      style: tabBarStyle,
      hideAdd,
      removeTab: this.removeTab,
      createNewTab: this.createNewTab,
    }
    const tabContentProps = {
      animated: tabPaneAnimated,
      animatedWithMargin: true,
    }
    const self = this
    const tabsProps = {
      props: {
        prefixCls,
        tabBarPosition: tabPosition,
        onChange: this.handleChange,
        tabBarProps: tabBarProps,
        tabContentProps: tabContentProps,
        destroyInactiveTabPane,
        activeKey,
        defaultActiveKey,
        type,
        onTabClick: this.onTabClick,
      },
      on: {
        change (val) {
          self.handleChange(val)
        },
      },
    }
    return (
      <Tabs
        class={cls}
        {...tabsProps}
      >
        {this.$slots.default}
      </Tabs>
    )
  },
}
</script>
