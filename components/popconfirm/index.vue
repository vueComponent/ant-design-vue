<script>
import omit from 'omit.js'
import Tooltip from '../tooltip'
import abstractTooltipProps from '../tooltip/abstractTooltipProps'
import PropTypes from '../_util/vue-types'
import { getOptionProps, hasProp, getComponentFromProp } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import buttonTypes from '../button/buttonTypes'
import Icon from '../icon'
import Button from '../button'

export default {
  name: 'popconfirm',
  props: {
    ...abstractTooltipProps,
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: abstractTooltipProps.trigger.def('click'),
    okType: buttonTypes.type.def('primary'),
    okText: PropTypes.any,
    cancelText: PropTypes.any,
  },
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'change',
  },
  data () {
    return {
      sVisible: this.$props.visible,
    }
  },
  methods: {
    onConfirm (e) {
      this.setVisible(false)
      this.$emit('confirm', e)
    },

    onCancel (e) {
      this.setVisible(false)
      this.$emit('cancel', e)
    },

    onVisibleChange (sVisible) {
      this.setVisible(sVisible)
    },

    setVisible (sVisible) {
      const props = this.$props
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible })
      }

      const { onVisibleChange } = props
      if (onVisibleChange) {
        onVisibleChange(sVisible)
      }
      this.$emit('change', sVisible)
    },
    getPopupDomNode () {
      return this.$refs.tooltip.getPopupDomNode()
    },
  },
  render (h) {
    const { prefixCls, okType } = this.$props
    const props = getOptionProps(this)
    const otherProps = omit(props, [
      'title',
      'content',
      'cancelText',
      'okText',
    ])
    const tooltipProps = {
      props: {
        ...otherProps,
        visible: this.sVisible,
      },
      ref: 'tooltip',
      on: {
        change: this.onVisibleChange,
      },
    }
    const overlay = (
      <div>
        <div class={`${prefixCls}-inner-content`}>
          <div class={`${prefixCls}-message`}>
            <Icon type='exclamation-circle' />
            <div class={`${prefixCls}-message-title`}>
              {getComponentFromProp(this, h, 'title')}
            </div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            <Button onClick={this.onCancel} size='small'>
              {getComponentFromProp(this, h, 'cancelText')}
            </Button>
            <Button onClick={this.onConfirm} type={okType} size='small'>
              {getComponentFromProp(this, h, 'okText')}
            </Button>
          </div>
        </div>
      </div>
    )
    return (
      <Tooltip
        {...tooltipProps}
      >
        <template slot='title'>
          {overlay}
        </template>
        {this.$slots.default}
      </Tooltip>
    )
  },
}

</script>
