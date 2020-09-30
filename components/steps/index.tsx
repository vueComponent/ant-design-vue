import { App, defineComponent, HTMLAttributes, inject, SetupContext } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import VcSteps from '../vc-steps';
import { defaultConfigProvider } from '../config-provider';

// prefixCls: PropTypes.string,
//     iconPrefix: PropTypes.string,
//     current: PropTypes.number,
//     initial: PropTypes.number,
//     labelPlacement: PropTypes.oneOf(['horizontal', 'vertical']).def('horizontal'),
//     status: PropTypes.oneOf(['wait', 'process', 'finish', 'error']),
//     size: PropTypes.oneOf(['default', 'small']),
//     direction: PropTypes.oneOf(['horizontal', 'vertical']),
//     progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//     type: PropTypes.oneOf(['default', 'navigation']),
//     onChange: PropTypes.func,
//     'onUpdate:current': PropTypes.func,

export interface StepsProps extends Omit<HTMLAttributes, 'onChange'> {
  prefixCls?: string;
  iconPrefix?: string;
  current?: number;
  initial?: number;
  labelPlacement?: 'horizontal' | 'vertical';
  status?: 'wait' | 'process' | 'finish' | 'error';
  size?: 'default' | 'small';
  direction?: 'horizontal' | 'vertical';
  progressDot?: boolean | Function;
  type?: 'default' | 'navigation';
  onChange?: Function;
  'onUpdate:current'?: Function;
}

const Steps = defineComponent({
  name: 'ASteps',
  inheritAttrs: false,
  emits: ['change', 'onUpdate:current'],
  setup(_: StepsProps, { emit, attrs, slots }: SetupContext) {
    const { getPrefixCls } = inject('configProvider', defaultConfigProvider);

    const props = attrs as StepsProps;

    const handleChange = (current: number) => {
      emit('update:current', current);
      emit('change', current);
    };

    return () => {
      const {
        current = 0,
        labelPlacement = 'horizontal',
        prefixCls: customizePrefixCls,
        iconPrefix: customizeIconPrefixCls,
        ...restProps
      } = props;

      const prefixCls = getPrefixCls('steps', customizePrefixCls);
      const iconPrefix = getPrefixCls('', customizeIconPrefixCls);
      const progressDot = 'progressDot' in props ? props['progressDot'] : slots.progressDot?.();
      // const progressDot = getComponent(this, 'progressDot', this, false);

      const icons = {
        finish: <CheckOutlined class={`${prefixCls}-finish-icon`} />,
        error: <CloseOutlined class={`${prefixCls}-error-icon`} />,
      };
      const stepsProps = {
        current,
        labelPlacement,
        icons,
        iconPrefix,
        prefixCls,
        progressDot,
        ...restProps,
        canClick: !!(props.onChange || props['onUpdate:current']),
        onChange: handleChange,
      };
      return <VcSteps {...stepsProps}>{slots.default?.()}</VcSteps>;
    };
  },
});

Steps.Step = { ...VcSteps.Step, name: 'AStep' };

Steps.install = function(app: App) {
  app.component(Steps.name, Steps);
  app.component(Steps.Step.name, Steps.Step);
};

export default Steps;
