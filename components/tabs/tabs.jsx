
import Tabs from './src/Tabs'
import isFlexSupported from '../_util/isFlexSupported'
import { hasProp, getComponentFromProp, getComponentName, isEmptyElement } from '../_util/props-util'
import warning from '../_util/warning'
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
        return ['default', 'small', 'large'].includes(value)
      },
    },
    animated: { type: [Boolean, Object], default: undefined },
    tabBarGutter: Number,
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
      tabBarGutter,
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
      [`${prefixCls}-small`]: size === 'small',
      [`${prefixCls}-large`]: size === 'large',
      [`${prefixCls}-default`]: size === 'default',
      [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
      [`${prefixCls}-card`]: type.indexOf('card') >= 0,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-no-animation`]: !tabPaneAnimated,
    }
    const tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent')
    const children = []
    $slots.default && $slots.default.forEach((child) => {
      if (isEmptyElement(child)) { return }
      const { componentOptions } = child
      const componentName = getComponentName(componentOptions)
      warning(componentName === 'TabPane', '`Tabs children just support TabPane')
      if (componentOptions && componentName === 'TabPane') {
        componentOptions.propsData = componentOptions.propsData || {}
        if (componentOptions.propsData.tab === undefined) {
          const tab = (componentOptions.children || []).filter(({ data = {}}) => data.slot === 'tab')
          componentOptions.propsData.tab = tab
        }
        children.push(child)
      }
    })
    const tabBarProps = {
      props: {
        hideAdd,
        removeTab: this.removeTab,
        createNewTab: this.createNewTab,
        inkBarAnimated,
        tabBarGutter,
      },
      on: {
        tabClick: onTabClick,
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
        {children}
        {tabBarExtraContent ? <template slot='tabBarExtraContent'>
          {tabBarExtraContent}
        </template> : null}
      </Tabs>
    )
  },
}

