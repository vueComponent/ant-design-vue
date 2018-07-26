import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import VcSteps from '../vc-steps';

var getStepsProps = function getStepsProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: PropTypes.string,
    iconPrefix: PropTypes.string,
    current: PropTypes.number,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
    size: PropTypes.oneOf(['default', 'small']),
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
  };
  return initDefaultProps(props, defaultProps);
};

export default {
  name: 'ASteps',
  props: getStepsProps({
    prefixCls: 'ant-steps',
    iconPrefix: 'ant',
    current: 0
  }),
  Step: _extends({}, VcSteps.Step, { name: 'AStep' }),
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var stepsProps = {
      props: props,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    };
    return h(
      VcSteps,
      stepsProps,
      [this.$slots['default']]
    );
  }
};