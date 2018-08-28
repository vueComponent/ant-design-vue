
import { Item, itemProps } from '../vc-menu'
import { getClass, getStyle, getOptionProps } from '../_util/props-util'
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
    const props = getOptionProps(this)
    const { getInlineCollapsed, $slots, $attrs: attrs, $listeners } = this
    const inlineCollapsed = getInlineCollapsed()
    const itemProps = {
      props,
      attrs,
      on: $listeners,
    }
    const toolTipProps = {
      props: {
        title: inlineCollapsed && props.level === 1 ? $slots.default : '',
        placement: 'right',
        overlayClassName: `${props.rootPrefixCls}-inline-collapsed-tooltip`,
      },
    }
    return (
      <Tooltip {...toolTipProps}>
        <Item {...itemProps} ref='menuItem'>
          {$slots.default}
        </Item>
      </Tooltip>
    )
  },
}

