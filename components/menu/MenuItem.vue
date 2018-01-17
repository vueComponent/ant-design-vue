<script>
import { Item, itemProps } from './src/index'
import { getClass, getStyle } from '../_util/vnode'
import Tooltip from '../tooltip'
import { getComponentFromProp } from '../_util/props-util'

export default {
  props: itemProps,
  inject: {
    inlineCollapsed: { default: false },
  },
  isMenuItem: 1,
  methods: {
    onKeyDown (e) {
      this.$refs.menuItem.onKeyDown(e)
    },
  },
  render (h) {
    const { inlineCollapsed, $props: props, $slots, $attrs: attrs, $listeners } = this
    const itemProps = {
      props,
      attrs,
      on: $listeners,
      class: getClass(this),
      style: getStyle(this),
    }
    return <Tooltip
      placement='right'
      overlayClassName={`${props.rootPrefixCls}-inline-collapsed-tooltip`}
    >
      <template slot='title'>
        {inlineCollapsed && props.level === 1 ? $slots.default : ''}
      </template>
      <Item {...itemProps} ref='menuItem'>
        {$slots.default}
      </Item>
    </Tooltip>
  },
}

</script>
