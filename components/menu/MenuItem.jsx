
import { Item, itemProps } from '../vc-menu'
import { getClass, getStyle } from '../_util/props-util'
import { cloneVNodes } from '../_util/vnode'
import Tooltip from '../tooltip'
function noop () {}
export default {
  props: itemProps,
  name: 'MenuItem',
  inject: {
    getInlineCollapsed: { default: () => noop },
  },
  isMenuItem: 1,
  methods: {
    onKeyDown (e) {
      this.$refs.menuItem.onKeyDown(e)
    },
  },
  render (h) {
    const { getInlineCollapsed, $props: props, $slots, $attrs: attrs, $listeners } = this
    const inlineCollapsed = getInlineCollapsed()
    const itemProps = {
      props,
      attrs,
      on: $listeners,
      class: getClass(this),
      style: getStyle(this),
    }
    const toolTipProps = {
      props: {
        placement: 'right',
        overlayClassName: `${props.rootPrefixCls}-inline-collapsed-tooltip`,
      },
      on: {},
    }
    return (
      inlineCollapsed && props.level === 1
        ? <Tooltip {...toolTipProps}>
          <template slot='title'>
            { cloneVNodes($slots.default, true) }
          </template>
          <Item {...itemProps} ref='menuItem'>
            {$slots.default}
          </Item>
        </Tooltip>
        : <Item {...itemProps} ref='menuItem'>
          {$slots.default}
        </Item>
    )
  },
}


