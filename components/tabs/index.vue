<script>
import Tabs from './Tabs'
import isFlexSupported from '../_util/isFlexSupported'
import hasProp from '../_util/props-util'
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
      $slots,
    } = this
    let { tabBarExtraContent } = this.$props
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
    tabBarExtraContent = tabBarExtraContent === undefined && $slots.tabBarExtraContent
      ? $slots.tabBarExtraContent : tabBarExtraContent
    tabBarExtraContent = typeof tabBarExtraContent === 'function'
      ? tabBarExtraContent(createElement) : tabBarExtraContent
    $slots.default && $slots.default.forEach(({ componentOptions, key: tabKey }) => {
      if (componentOptions && componentOptions.propsData.tab === undefined) {
        componentOptions.propsData.tab = $slots[`tab_${tabKey}`]
          ? $slots[`tab_${tabKey}`]
          : null
      }
    })
    const tabBarProps = {
      inkBarAnimated,
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
    if (hasProp(this, 'activeKey')) {
      tabsProps.props.activeKey = activeKey
    }
    return (
      <Tabs
        class={cls}
        {...tabsProps}
      >
        {this.$slots.default}
        {tabBarExtraContent ? <template slot='tabBarExtraContent'>
          {tabBarExtraContent}
        </template> : null}
      </Tabs>
    )
  },
}
</script>
