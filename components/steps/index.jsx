import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import VcSteps from '../vc-steps';
import Icon from '../icon';

const getStepsProps = (defaultProps = {}) => {
  const props = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
    initial: PropTypes.number,
    labelPlacement: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
    size: PropTypes.oneOf(['default', 'small']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  };
  return initDefaultProps(props, defaultProps);
};

const Steps = {
  name: 'ASteps',
  props: getStepsProps({
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0,
  }),
  Step: { ...VcSteps.Step, name: 'AStep' },
  render() {
    const props = getOptionProps(this);
    const { prefixCls } = props;
    const icons = {
      finish: <Icon type="check" class={`${prefixCls}-finish-icon`} />,
      error: <Icon type="close" class={`${prefixCls}-error-icon`} />,
    };
    const stepsProps = {
      props: {
        icons,
        ...props,
      },
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
    };
    return <VcSteps {...stepsProps}>{this.$slots.default}</VcSteps>;
  },
};

/* istanbul ignore next */
Steps.install = function(Vue) {
  Vue.component(Steps.name, Steps);
  Vue.component(Steps.Step.name, Steps.Step);
};

export default Steps;
