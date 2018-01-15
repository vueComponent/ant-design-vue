<script>
import Tooltip from '../tooltip'
import abstractTooltipProps from '../tooltip/abstractTooltipProps'
import PropTypes from '../_util/vue-types'
import { getOptionProps, getComponentFromProp } from '../_util/props-util'

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
  },

  render (h) {
    const { title, prefixCls, $slots } = this
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
          <div>
            {(title || $slots.title) &&
            <div class={`${prefixCls}-title`}>
              {getComponentFromProp(this, h, 'title')}
            </div>
            }
            <div class={`${prefixCls}-inner-content`}>
              {getComponentFromProp(this, h, 'content')}
            </div>
          </div>
        </template>
        {this.$slots.default}
      </Tooltip>
    )
  },
}

</script>
