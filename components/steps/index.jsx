import { inject } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, getComponent, getSlot } from '../_util/props-util';
import VcSteps from '../vc-steps';
import { ConfigConsumerProps } from '../config-provider';

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
    type: PropTypes.oneOf(['default', 'navigation']),
    onChange: PropTypes.func,
    'onUpdate:current': PropTypes.func,
  };
  return initDefaultProps(props, defaultProps);
};

const Steps = {
  name: 'ASteps',
  inheritAttrs: false,
  props: getStepsProps({
    current: 0,
  }),
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  Step: { ...VcSteps.Step, name: 'AStep' },
  methods: {
    handleChange(current) {
      this.$emit('update:current', current);
      this.$emit('change', current);
    },
  },
  render() {
    const props = { ...getOptionProps(this), ...this.$attrs };
    const { prefixCls: customizePrefixCls, iconPrefix: customizeIconPrefixCls } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('steps', customizePrefixCls);
    const iconPrefix = getPrefixCls('', customizeIconPrefixCls);
    const progressDot = getComponent(this, 'progressDot', this, false);

    const icons = {
      finish: <CheckOutlined class={`${prefixCls}-finish-icon`} />,
      error: <CloseOutlined class={`${prefixCls}-error-icon`} />,
    };
    const stepsProps = {
      icons,
      iconPrefix,
      prefixCls,
      progressDot,
      ...props,
      canClick: !!(this.onChange || this['onUpdate:current']),
      onChange: this.handleChange,
    };
    return <VcSteps {...stepsProps}>{getSlot(this)}</VcSteps>;
  },
};

/* istanbul ignore next */
Steps.install = function(app) {
  app.component(Steps.name, Steps);
  app.component(Steps.Step.name, Steps.Step);
};

export default Steps;
