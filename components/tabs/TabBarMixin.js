export default {
  methods: {
    getTabs () {
      const { panels: children, activeKey, prefixCls } = this
      const rst = []
      children.forEach((child) => {
        if (!child) {
          return
        }
        const key = child.pKey
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
            {child.tab}
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
          <div key='extra' class='`${prefixCls}-extra-content`' style={tabBarExtraContentStyle}>
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
