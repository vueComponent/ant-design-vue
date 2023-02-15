import type { App, ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import VcSteps, { Step as VcStep } from '../vc-steps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import Progress from '../progress';
import omit from '../_util/omit';
import { VcStepProps } from '../vc-steps/Step';
import type { ProgressDotRender } from '../vc-steps/Steps';
import type { MouseEventHandler } from '../_util/EventInterface';
import { booleanType, stringType, functionType, someType } from '../_util/type';

// CSSINJS
import useStyle from './style';
import { useToken } from '../theme/internal';

export const stepsProps = () => ({
  prefixCls: String,
  iconPrefix: String,
  current: Number,
  initial: Number,
  percent: Number,
  responsive: booleanType(),
  labelPlacement: stringType<'horizontal' | 'vertical'>(),
  status: stringType<'wait' | 'process' | 'finish' | 'error'>(),
  size: stringType<'default' | 'small'>(),
  direction: stringType<'horizontal' | 'vertical'>(),
  progressDot: someType<boolean | ProgressDotRender>(
    [Boolean, Function],
    undefined as boolean | ProgressDotRender,
  ),
  type: stringType<'default' | 'navigation'>(),
  onChange: functionType<(current: number) => void>(),
  'onUpdate:current': functionType<(current: number) => void>(),
});

export const stepProps = () => ({
  description: PropTypes.any,
  icon: PropTypes.any,
  status: stringType<'wait' | 'process' | 'finish' | 'error'>(),
  disabled: booleanType(),
  title: PropTypes.any,
  subTitle: PropTypes.any,
  onClick: functionType<MouseEventHandler>(),
});

export type StepsProps = Partial<ExtractPropTypes<ReturnType<typeof stepsProps>>>;

export type StepProps = Partial<ExtractPropTypes<ReturnType<typeof stepProps>>>;

const Steps = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASteps',
  inheritAttrs: false,
  props: initDefaultProps(stepsProps(), {
    current: 0,
    responsive: true,
    labelPlacement: 'horizontal',
  }),
  slots: ['progressDot'],
  // emits: ['update:current', 'change'],
  setup(props, { attrs, slots, emit }) {
    const { prefixCls, direction: rtlDirection, configProvider } = useConfigInject('steps', props);

    // 接入换肤
    const [, token] = useToken();

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

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
          <div class={`${prefixCls.value}-progress-icon`}>
            <Progress
              type="circle"
              percent={props.percent}
              width={progressWidth}
              strokeColor={token.value.colorPrimary}
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
        hashId.value,
      );
      const icons = {
        finish: <CheckOutlined class={`${prefixCls}-finish-icon`} />,
        error: <CloseOutlined class={`${prefixCls}-error-icon`} />,
      };
      return wrapSSR(
        <VcSteps
          icons={icons}
          {...attrs}
          {...omit(props, ['percent', 'responsive'])}
          direction={direction.value}
          prefixCls={prefixCls.value}
          iconPrefix={iconPrefix.value}
          class={stepsClassName}
          onChange={handleChange}
          v-slots={{ ...slots, stepIcon: stepIconRender }}
        />,
      );
    };
  },
});

/* istanbul ignore next */
export const Step = defineComponent({
  compatConfig: { MODE: 3 },
  ...VcStep,
  name: 'AStep',
  props: VcStepProps(),
});
export default Object.assign(Steps, {
  Step,
  install: (app: App) => {
    app.component(Steps.name, Steps);
    app.component(Step.name, Step);
    return app;
  },
});
