<script>
import Tabs from './src/Tabs'
import isFlexSupported from '../_util/isFlexSupported'
import { hasProp, getComponentFromProp } from '../_util/props-util'
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
      onPrevClick,
      onNextClick,
      animated,
      destroyInactiveTabPane = false,
      activeKey,
      defaultActiveKey,
      $slots,
    } = this
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
    const tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent')
    $slots.default && $slots.default.forEach(({ componentOptions, key: tabKey }) => {
      if (componentOptions && componentOptions.propsData.tab === undefined) {
        const tab = (componentOptions.children || []).filter(({ data = {}}) => data.slot === 'tab')
        componentOptions.propsData.tab = tab
      }
    })
    const tabBarProps = {
      props: {
        hideAdd,
        removeTab: this.removeTab,
        createNewTab: this.createNewTab,
        inkBarAnimated,
      },
      on: {
        // tabClick: onTabClick,
        prevClick: onPrevClick,
        nextClick: onNextClick,
      },
      style: tabBarStyle,
    }
    const tabContentProps = {
      props: {
        animated: tabPaneAnimated,
        animatedWithMargin: true,
      },
    }
    const tabsProps = {
      props: {
        prefixCls,
        tabBarPosition: tabPosition,
        tabBarProps: tabBarProps,
        tabContentProps: tabContentProps,
        destroyInactiveTabPane,
        defaultActiveKey,
        type,
      },
      on: {
        change: this.handleChange,
        tabClick: this.onTabClick,
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
