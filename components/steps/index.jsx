
import PropTypes from '../_util/vue-types'
import { initDefaultProps, getOptionProps } from '../_util/props-util'
import VcSteps from '../vc-steps'

const getStepsProps = (defaultProps = {}) => {
  const props = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
    size: PropTypes.oneOf(['default', 'small']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    progressDot: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
  }
  return initDefaultProps(props, defaultProps)
}

export default {
  name: 'Steps',
  props: getStepsProps({
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0,
  }),
  Step: VcSteps.Step,
  render () {
    const props = getOptionProps(this)
    const stepsProps = {
      props,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
    }
    return (
      <VcSteps
        {...stepsProps}
      >
        {this.$slots.default}
      </VcSteps>
    )
  },
}

