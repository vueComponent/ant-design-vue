
import omit from 'omit.js'
import Tooltip from '../tooltip'
import abstractTooltipProps from '../tooltip/abstractTooltipProps'
import PropTypes from '../_util/vue-types'
import { getOptionProps, hasProp, getComponentFromProp } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import buttonTypes from '../button/buttonTypes'
import Icon from '../icon'
import Button from '../button'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'

const tooltipProps = abstractTooltipProps()
const btnProps = buttonTypes()
export default {
  name: 'APopconfirm',
  props: {
    ...tooltipProps,
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    okText: PropTypes.any,
    cancelText: PropTypes.any,
  },
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  watch: {
    visible (val) {
      this.sVisible = val
    },
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
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible })
      }
      this.$emit('visibleChange', sVisible)
    },
    getPopupDomNode () {
      return this.$refs.tooltip.getPopupDomNode()
    },
    renderOverlay (popconfirmLocale) {
      const { prefixCls, okType } = this
      return (
        <div class={`${prefixCls}-inner-content`}>
          <div class={`${prefixCls}-message`}>
            <Icon type='exclamation-circle' />
            <div class={`${prefixCls}-message-title`}>
              {getComponentFromProp(this, 'title')}
            </div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            <Button onClick={this.onCancel} size='small'>
              {getComponentFromProp(this, 'cancelText') || popconfirmLocale.cancelText}
            </Button>
            <Button onClick={this.onConfirm} type={okType} size='small'>
              {getComponentFromProp(this, 'okText') || popconfirmLocale.okText}
            </Button>
          </div>
        </div>
      )
    },
  },
  render (h) {
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
      <LocaleReceiver
        componentName='Popconfirm'
        defaultLocale={defaultLocale.Popconfirm}
        scopedSlots={
          { default: this.renderOverlay }
        }
      />)
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

