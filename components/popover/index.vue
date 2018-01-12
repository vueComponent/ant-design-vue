<script>
import Tooltip from '../tooltip'
import abstractTooltipProps from '../tooltip/abstractTooltipProps'
import PropTypes from '../_util/vue-types'
import { getOptionProps } from '../_util/props-util'

export default {
  name: 'popover',
  props: {
    ...abstractTooltipProps,
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
  },
  model: {
    prop: 'visible',
    event: 'change',
  },
  methods: {
    getPopupDomNode () {
      return this.$refs.tooltip.getPopupDomNode()
    },
    getOverlay (h) {
      const { title, prefixCls, content, $slots } = this
      return (
        <div>
          {(title || $slots.title) &&
            <div class={`${prefixCls}-title`}>
              {typeof title === 'function' ? title(h) : title}
              {$slots.title}
            </div>
          }
          <div class={`${prefixCls}-inner-content`}>
            {typeof content === 'function' ? content(h) : content}
            {$slots.content}
          </div>
        </div>
      )
    },
  },

  render (h) {
    const props = getOptionProps(this)
    delete props.title
    delete props.content
    const tooltipProps = {
      props: {
        ...props,
      },
      ref: 'tooltip',
      on: this.$listeners,
    }
    return (
      <Tooltip
        {...tooltipProps}
      >
        <template slot='title'>
          {this.getOverlay(h)}
        </template>
        {this.$slots.default}
      </Tooltip>
    )
  },
}

</script>
