<script>
import Tabs from './Tabs'
// import TabPane from './TabPane'
import ScrollableInkTabBar from './ScrollableInkTabBar'
import TabBar from './TabBar'
import TabContent from './TabContent'
import Icon from '../icon'
import isFlexSupported from '../_util/isFlexSupported'
export default {
  props: {
    prefixCls: { type: String, default: 'ant-tabs' },
    activeKey: String,
    defaultActiveKey: String,
    hideAdd: { type: Boolean, default: false },
    onChange: { type: Function, default: () => {} },
    onTabClick: { type: Function, default: () => {} },
    onPrevClick: { type: Function, default: () => {} },
    onNextClick: { type: Function, default: () => {} },
    tabBarStyle: Object,
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
    onEdit: { type: Function, default: () => {} },
    size: {
      validator (value) {
        return ['default', 'small'].includes(value)
      },
    },
    animated: Boolean | Object,
  },
  methods: {
    createNewTab (targetKey) {
      const onEdit = this.$props.onEdit
      if (onEdit) {
        onEdit(targetKey, 'add')
      }
    },

    removeTab (targetKey, e) {
      e.stopPropagation()
      if (!targetKey) {
        return
      }

      const onEdit = this.$props.onEdit
      if (onEdit) {
        onEdit(targetKey, 'remove')
      }
    },

    handleChange (activeKey) {
      // const onChange = this.$props.onChange
      // if (onChange) {
      //   onChange(activeKey)
      // }
      this.$emit('change', activeKey)
    },
  },

  mounted () {
    const NO_FLEX = ' no-flex'
    const tabNode = this.$el
    if (tabNode && !isFlexSupported() && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX
    }
  },

  render () {
    const {
      prefixCls,
      size,
      type = 'line',
      tabPosition,
      tabBarStyle,
      // hideAdd,
      onTabClick,
      onPrevClick,
      onNextClick,
      animated = true,
    } = this.$props
    let { tabBarExtraContent } = this.$props
    let { inkBarAnimated, tabPaneAnimated } = typeof animated === 'object' ? { // eslint-disable-line
      inkBarAnimated: animated.inkBar, tabPaneAnimated: animated.tabPane,
    } : {
      inkBarAnimated: animated, tabPaneAnimated: animated,
    }

    // card tabs should not have animation
    if (type !== 'line') {
      tabPaneAnimated = 'animated' in this.$props ? tabPaneAnimated : false
    }
    const cls = {
      [`${prefixCls}-mini`]: size === 'small' || size,
      [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
      [`${prefixCls}-card`]: type.indexOf('card') >= 0,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-no-animation`]: !tabPaneAnimated,
    }
    // only card type tabs can be added and closed
    let childrenWithClose
    // if (type === 'editable-card') {
    //   childrenWithClose = []
    //   React.Children.forEach(children, (child, index) => {
    //     let closable = child.props.closable
    //     closable = typeof closable === 'undefined' ? true : closable
    //     const closeIcon = closable ? (
    //       <Icon
    //         type='close'
    //         onClick={e => this.removeTab(child.key, e)}
    //       />
    //     ) : null
    //     childrenWithClose.push(cloneElement(child, {
    //       tab: (
    //         <div className={closable ? undefined : `${prefixCls}-tab-unclosable`}>
    //           {child.props.tab}
    //           {closeIcon}
    //         </div>
    //       ),
    //       key: child.key || index,
    //     }))
    //   })
    //   // Add new tab handler
    //   if (!hideAdd) {
    //     tabBarExtraContent = (
    //       <span>
    //         <Icon type='plus' className={`${prefixCls}-new-tab`} onClick={this.createNewTab} />
    //         {tabBarExtraContent}
    //       </span>
    //     )
    //   }
    // }

    tabBarExtraContent = tabBarExtraContent ? (
      <div class={`${prefixCls}-extra-content`}>
        {tabBarExtraContent}
      </div>
    ) : null

    // const renderTabBar = () => (
    //   <ScrollableInkTabBar
    //     inkBarAnimated={inkBarAnimated}
    //     extraContent={tabBarExtraContent}
    //     onTabClick={onTabClick}
    //     onPrevClick={onPrevClick}
    //     onNextClick={onNextClick}
    //     style={tabBarStyle}
    //   />
    // )
    const tabBarProps = {
      inkBarAnimated,
      extraContent: tabBarExtraContent,
      onTabClick,
      onPrevClick,
      onNextClick,
      style: tabBarStyle,
    }
    const tabContentProps = {
      animated: tabPaneAnimated,
      animatedWithMargin: true,
    }
    return (
      <Tabs
        {...this.$props}
        class={cls}
        tabBarPosition={tabPosition}
        onChange={this.handleChange}
        tabBarProps={tabBarProps}
        tabContentProps={tabContentProps}
      >
        {childrenWithClose || this.$slots.default}
      </Tabs>
    )
  },
}
</script>
