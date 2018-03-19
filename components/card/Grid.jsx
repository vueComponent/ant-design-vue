
import PropTypes from '../_util/vue-types'

export default {
  name: 'Grid',
  props: {
    prefixCls: PropTypes.string.def('ant-card'),
  },
  render () {
    const { prefixCls = 'ant-card', ...others } = this.$props
    const classString = {
      [`${prefixCls}-grid`]: true,
    }
    return (
      <div {...others} class={classString}>{this.$slots.default}</div>
    )
  },
}

