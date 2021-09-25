import type { App, ExtractPropTypes, Plugin } from 'vue';
import { computed, defineComponent } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import PropTypes, { withUndefined } from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import VcSteps from '../vc-steps';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import Progress from '../progress';
import omit from '../_util/omit';

export const stepsProps = () => ({
  prefixCls: PropTypes.string,
  iconPrefix: PropTypes.string,
  current: PropTypes.number,
  initial: PropTypes.number,
  percent: PropTypes.number,
  responsive: PropTypes.looseBool,
  labelPlacement: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  status: PropTypes.oneOf(tuple('wait', 'process', 'finish', 'error')),
  size: PropTypes.oneOf(tuple('default', 'small')),
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')),
  progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
  type: PropTypes.oneOf(tuple('default', 'navigation')),
  onChange: PropTypes.func,
  'onUpdate:current': PropTypes.func,
});

export const stepProps = () => ({
  description: PropTypes.any,
  icon: PropTypes.any,
  status: PropTypes.oneOf(tuple('wait', 'process', 'finish', 'error')),
  disabled: PropTypes.looseBool,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  onClick: PropTypes.func,
});

export type StepsProps = Partial<ExtractPropTypes<ReturnType<typeof stepsProps>>>;

export type StepProps = Partial<ExtractPropTypes<ReturnType<typeof stepProps>>>;

const Steps = defineComponent({
  name: 'ASteps',
  inheritAttrs: false,
  props: initDefaultProps(stepsProps(), {
    current: 0,
    responsive: true,
  }),
  slots: ['progressDot'],
  emits: ['update:current', 'change'],
  setup(props, { attrs, slots, emit }) {
    const { prefixCls, direction: rtlDirection, configProvider } = useConfigInject('steps', props);
    const screens = useBreakpoint();
    const direction = computed(() =>
      props.responsive && screens.value.xs ? 'vertical' : props.direction,
    );
    const iconPrefix = computed(() => configProvider.getPrefixCls('', props.iconPrefix));
    const handleChange = (current: number) => {
      emit('update:current', current);
      emit('change', current);
    };
    const stepIconRender = ({
      node,
      status,
    }: {
      node: any;
      index: number;
      status: string;
      title: any;
      description: any;
    }) => {
      if (status === 'process' && props.percent !== undefined) {
        // currently it's hard-coded, since we can't easily read the actually width of icon
        const progressWidth = props.size === 'small' ? 32 : 40;
        const iconWithProgress = (
          <div class={`${prefixCls}-progress-icon`}>
            <Progress
              type="circle"
              percent={props.percent}
              width={progressWidth}
              strokeWidth={4}
              format={() => null}
            />
            {node}
          </div>
        );
        return iconWithProgress;
      }
      return node;
    };
    return () => {
      const stepsClassName = classNames(
        {
          [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
          [`${prefixCls.value}-with-progress`]: props.percent !== undefined,
        },
        attrs.class,
      );
      const icons = {
        finish: <CheckOutlined class={`${prefixCls}-finish-icon`} />,
        error: <CloseOutlined class={`${prefixCls}-error-icon`} />,
      };
      return (
        <VcSteps
          icons={icons}
          {...omit(props, ['percent', 'responsive'])}
          direction={direction.value}
          prefixCls={prefixCls.value}
          iconPrefix={iconPrefix.value}
          class={stepsClassName}
          onChange={handleChange}
          v-slots={{ ...slots, stepIcon: stepIconRender }}
        />
      );
    };
  },
  Step: { ...VcSteps.Step, name: 'AStep' },
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
