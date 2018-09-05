import Icon from '../icon'
import VcTabs, { TabPane } from '../vc-tabs/src'
import ScrollableInkTabBar from '../vc-tabs/src/ScrollableInkTabBar'
import TabContent from '../vc-tabs/src/TabContent'
import isFlexSupported from '../_util/isFlexSupported'
import { hasProp, getComponentFromProp, isEmptyElement, getSlotOptions, getOptionProps, filterEmpty, mergeProps } from '../_util/props-util'
import warning from '../_util/warning'
import { cloneElement } from '../_util/vnode'
export default {
  TabPane,
  name: 'ATabs',
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
    const children = filterEmpty(this.$slots.default)
    let tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent')
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
    // only card type tabs can be added and closed
    let childrenWithClose = []
    if (type === 'editable-card') {
      childrenWithClose = []
      children.forEach((child, index) => {
        const props = getOptionProps(child)
        let closable = props.closable
        closable = typeof closable === 'undefined' ? true : closable
        const closeIcon = closable ? (
          <Icon
            type='close'
            onClick={e => this.removeTab(child.key, e)}
          />
        ) : null
        childrenWithClose.push(cloneElement(child, {
          props: {
            tab: (
              <div class={closable ? undefined : `${prefixCls}-tab-unclosable`}>
                {getComponentFromProp(child, 'tab')}
                {closeIcon}
              </div>
            ),
          },
          key: child.key || index,
        }))
      })
      // Add new tab handler
      if (!hideAdd) {
        tabBarExtraContent = (
          <span>
            <Icon type='plus' class={`${prefixCls}-new-tab`} onClick={this.createNewTab} />
            {tabBarExtraContent}
          </span>
        )
      }
    }

    tabBarExtraContent = tabBarExtraContent ? (
      <div class={`${prefixCls}-extra-content`}>
        {tabBarExtraContent}
      </div>
    ) : null

    const renderTabBar = () => {
      const scrollableInkTabBarProps = {
        props: {
          inkBarAnimated,
          extraContent: tabBarExtraContent,
          tabBarGutter,
        },
        on: {
          tabClick: onTabClick,
          prevClick: onPrevClick,
          nextClick: onNextClick,
        },
        style: tabBarStyle,
      }
      return <ScrollableInkTabBar {...scrollableInkTabBarProps}/>
    }
    const tabsProps = {
      props: {
        ...getOptionProps(this),
        tabBarPosition: tabPosition,
        renderTabBar: renderTabBar,
        renderTabContent: () => <TabContent animated={tabPaneAnimated} animatedWithMargin />,
        children: childrenWithClose.length > 0 ? childrenWithClose : children,
        __propsSymbol__: Symbol(),
      },
    }
    return (
      <VcTabs
        {...tabsProps}
        class={cls}
        onChange={this.handleChange}
      />
    )
    // const tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent')
    // const children = []
    // $slots.default && $slots.default.forEach((child) => {
    //   if (isEmptyElement(child)) { return }
    //   const { componentOptions } = child
    //   const __ANT_TAB_PANE = getSlotOptions(child).__ANT_TAB_PANE
    //   warning(__ANT_TAB_PANE, '`Tabs children just support TabPane')
    //   if (componentOptions && __ANT_TAB_PANE) {
    //     componentOptions.propsData = componentOptions.propsData || {}
    //     if (componentOptions.propsData.tab === undefined) {
    //       const tab = (componentOptions.children || []).filter(({ data = {}}) => data.slot === 'tab')
    //       componentOptions.propsData.tab = tab
    //     }
    //     children.push(child)
    //   }
    // })
    // const tabBarProps = {
    //   props: {
    //     hideAdd,
    //     removeTab: this.removeTab,
    //     createNewTab: this.createNewTab,
    //     inkBarAnimated,
    //     tabBarGutter,
    //   },
    //   on: {
    //     tabClick: onTabClick,
    //     prevClick: onPrevClick,
    //     nextClick: onNextClick,
    //   },
    //   style: tabBarStyle,
    // }
    // const tabContentProps = {
    //   props: {
    //     animated: tabPaneAnimated,
    //     animatedWithMargin: true,
    //   },
    // }
    // const tabsProps = {
    //   props: {
    //     prefixCls,
    //     tabBarPosition: tabPosition,
    //     tabBarProps: tabBarProps,
    //     tabContentProps: tabContentProps,
    //     destroyInactiveTabPane,
    //     defaultActiveKey,
    //     type,
    //   },
    //   on: {
    //     change: this.handleChange,
    //     tabClick: this.onTabClick,
    //   },
    // }
    // if (hasProp(this, 'activeKey')) {
    //   tabsProps.props.activeKey = activeKey
    // }
    // return (
    //   <Tabs
    //     class={cls}
    //     {...tabsProps}
    //   >
    //     {children}
    //     {tabBarExtraContent ? <template slot='tabBarExtraContent'>
    //       {tabBarExtraContent}
    //     </template> : null}
    //   </Tabs>
    // )
  },
}

