export default {
  props: {
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    tabBarPosition: {
      default: 'top',
      type: String,
    },
    disabled: Boolean,
    onKeyDown: {
      default: () => {},
      type: Function,
    },
    onTabClick: {
      default: () => {},
      type: Function,
    },
    activeKey: String,
    panels: Array,
  },
  methods: {
    getTabs (h) {
      const { panels: children, activeKey, prefixCls } = this
      const rst = []
      children.forEach((child) => {
        if (!child) {
          return
        }
        // componentOptions.propsData中获取的值disabled没有根据类型初始化, 会出现空字符串
        child.disabled = child.disabled === '' || child.disabled
        const key = child.tabKey
        let cls = activeKey === key ? `${prefixCls}-tab-active` : ''
        cls += ` ${prefixCls}-tab`
        if (child.disabled) {
          cls += ` ${prefixCls}-tab-disabled`
        } else {
        }
        const onClick = () => {
          !child.disabled && this.onTabClick(key)
        }
        // const ref = {}
        // if (activeKey === key) {
        //   ref.ref = this.saveRef('activeTab')
        // }
        rst.push(
          <div
            role='tab'
            aria-disabled={child.disabled ? 'true' : 'false'}
            aria-selected={activeKey === key ? 'true' : 'false'}
            class={cls}
            key={key}
            onClick={onClick}
            ref={activeKey === key ? 'activeTab' : undefined}
          >
            {typeof child.tab === 'function' ? child.tab(h, key) : child.tab}
          </div>
        )
      })

      return rst
    },
    getRootNode (contents, createElement) {
      const {
        prefixCls, onKeyDown, tabBarPosition, $slots,
      } = this
      const cls = {
        [`${prefixCls}-bar`]: true,
      }
      const topOrBottom = (tabBarPosition === 'top' || tabBarPosition === 'bottom')
      const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {}
      let children = contents
      if ($slots.default) {
        children = [
          <div key='extra' class={`${prefixCls}-extra-content`} style={tabBarExtraContentStyle}>
            {$slots.default}
          </div>,
          contents,
        ]
        children = topOrBottom ? children : children.reverse()
      }
      return (
        <div
          role='tablist'
          class={cls}
          tabIndex='0'
          ref='root'
          onKeydown={onKeyDown}
        >
          {children}
        </div>
      )
    },
  },
}
