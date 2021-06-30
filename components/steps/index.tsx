import type { App, ExtractPropTypes, Plugin } from 'vue';
import { defineComponent, inject } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import PropTypes, { withUndefined } from '../_util/vue-types';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import VcSteps from '../vc-steps';
import { defaultConfigProvider } from '../config-provider';
import { tuple } from '../_util/type';

const stepsProps = {
  prefixCls: PropTypes.string,
  iconPrefix: PropTypes.string,
  current: PropTypes.number,
  initial: PropTypes.number,
  labelPlacement: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  status: PropTypes.oneOf(tuple('wait', 'process', 'finish', 'error')),
  size: PropTypes.oneOf(tuple('default', 'small')),
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
  type: PropTypes.oneOf(tuple('default', 'navigation')),
  onChange: PropTypes.func,
  'onUpdate:current': PropTypes.func,
};

export type StepsProps = Partial<ExtractPropTypes<typeof stepsProps>>;

const Steps = defineComponent({
  name: 'ASteps',
  inheritAttrs: false,
  props: initDefaultProps(stepsProps, {
    current: 0,
  }),
  emits: ['update:current', 'change'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  Step: { ...VcSteps.Step, name: 'AStep' },
  methods: {
    handleChange(current: number) {
      this.$emit('update:current', current);
      this.$emit('change', current);
    },
  },
  render() {
    const props: StepsProps = { ...getOptionProps(this), ...this.$attrs };
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
});

/* istanbul ignore next */
Steps.install = function (app: App) {
  app.component(Steps.name, Steps);
  app.component(Steps.Step.name, Steps.Step);
  return app;
};

export const Step = Steps.Step;

export default Steps as typeof Steps &
  Plugin & {
    readonly Step: typeof VcSteps.Step;
  };
