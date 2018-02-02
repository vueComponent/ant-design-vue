<script>
import PanelContent from './PanelContent'
import { panelProps } from './commonProps'

export default {
  name: 'Panel',
  props: {
    ...panelProps,
  },
  methods: {
    handleItemClick () {
      this.$emit('itemClick')
    },
  },
  render () {
    const {
      prefixCls,
      header,
      headerClass,
      isActive,
      showArrow,
      destroyInactivePanel,
      disabled,
      openAnimation,
    } = this.$props
    const { $slots } = this

    const transitionProps = {
      props: Object.assign({
        appear: false,
        css: false,
      }),
      on: { ...openAnimation },
    }
    const headerCls = {
      [`${prefixCls}-header`]: true,
      [headerClass]: headerClass,
    }
    const headerCon = header || $slots.header
    const itemCls = {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [`${prefixCls}-item-disabled`]: disabled,
    }
    return (
      <div class={itemCls} role='tablist'>
        <div
          class={headerCls}
          onClick={this.handleItemClick.bind(this)}
          role='tab'
          aria-expanded={isActive}
        >
          {showArrow && <i class='arrow' />}
          {headerCon}
        </div><transition
          {...transitionProps}
        >
          <PanelContent
            prefixCls={prefixCls}
            isActive={isActive}
            destroyInactivePanel={destroyInactivePanel}
          >
            {$slots.default}
          </PanelContent>
        </transition>
      </div>
    )
  },
}
</script>
