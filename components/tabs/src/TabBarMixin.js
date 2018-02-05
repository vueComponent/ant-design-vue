import Icon from '../../icon'
function noop () {
}
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
    activeKey: String,
    panels: Array,
    hideAdd: Boolean,
    removeTab: {
      default: noop,
      type: Function,
    },
    createNewTab: {
      default: noop,
      type: Function,
    },
    tabBarGutter: Number,
  },
  methods: {
    getTabs (h) {
      const { panels: children, activeKey, prefixCls, tabBarGutter } = this
      const rst = []
      children.forEach((child, index) => {
        if (!child) {
          return
        }
        let { disabled, closable } = child
        const { tabKey, tab } = child
        // componentOptions.propsData中获取的值disabled没有根据类型初始化, 会出现空字符串
        disabled = disabled === '' || disabled
        let cls = activeKey === tabKey ? `${prefixCls}-tab-active` : ''
        cls += ` ${prefixCls}-tab`
        if (disabled) {
          cls += ` ${prefixCls}-tab-disabled`
        } else {
        }
        const onClick = () => {
          !disabled && this.__emit('tabClick', tabKey)
        }

        let tabC = typeof tab === 'function' ? child.tab(h) : tab
        if (this.$parent.type === 'editable-card') {
          closable = closable === undefined ? true : closable === '' || closable
          const closeIcon = closable ? (
            <Icon
              type='close'
              onClick={e => this.removeTab(tabKey, e)}
            />
          ) : null
          tabC = <div class={closable ? undefined : `${prefixCls}-tab-unclosable`}>
            {tabC}
            {closeIcon}
          </div>
        }

        rst.push(
          <div
            role='tab'
            aria-disabled={disabled ? 'true' : 'false'}
            aria-selected={activeKey === tabKey ? 'true' : 'false'}
            class={cls}
            key={tabKey}
            onClick={onClick}
            style={{ marginRight: tabBarGutter && index === children.length - 1 ? `0px` : `${tabBarGutter}px` }}
            ref={activeKey === tabKey ? 'activeTab' : undefined}
          >
            {tabC}
          </div>
        )
      })

      return rst
    },
    onKeyDown (e) {
      this.__emit('keydown', e)
    },
    getRootNode (contents, createElement) {
      const {
        prefixCls, onKeyDown, tabBarPosition, hideAdd,
      } = this
      let extraContent = this.$slots.extraContent
      const tabsType = this.$parent.type
      const cls = {
        [`${prefixCls}-bar`]: true,
      }
      const topOrBottom = (tabBarPosition === 'top' || tabBarPosition === 'bottom')
      const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {}
      let children = contents
      if (tabsType === 'editable-card' && !hideAdd) {
        extraContent = (
          <span>
            <Icon type='plus' class={`${prefixCls}-new-tab`} onClick={this.createNewTab} />
            {extraContent}
          </span>
        )
      }

      children = [
        <div key='extra' class={`${prefixCls}-extra-content`} style={tabBarExtraContentStyle}>
          {extraContent}
        </div>,
        contents,
      ]
      children = topOrBottom ? children : children.reverse()

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
