import type { App, ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import CheckOutlined from '@ant-design/icons-vue/CheckOutlined';
import type { VueNode, CustomSlotsType } from '../_util/type';
import { anyType, booleanType, stringType, functionType, someType, arrayType } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import VcSteps, { Step as VcStep } from '../vc-steps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import Progress from '../progress';
import omit from '../_util/omit';
import Tooltip from '../tooltip';
import { VcStepProps } from '../vc-steps/Step';
import type { Status, ProgressDotRender } from '../vc-steps/interface';
import type { MouseEventHandler } from '../_util/EventInterface';
import { useToken } from '../theme/internal';

// CSSINJS
import useStyle from './style';

export const stepsProps = () => ({
  prefixCls: String,
  iconPrefix: String,
  current: Number,
  initial: Number,
  percent: Number,
  responsive: booleanType(),
  items: arrayType<StepProps[]>(),
  labelPlacement: stringType<'horizontal' | 'vertical'>(),
  status: stringType<Status>(),
  size: stringType<'default' | 'small'>(),
  direction: stringType<'horizontal' | 'vertical'>(),
  progressDot: someType<boolean | ProgressDotRender>([Boolean, Function]),
  type: stringType<'default' | 'navigation' | 'inline'>(),
  onChange: functionType<(current: number) => void>(),
  'onUpdate:current': functionType<(current: number) => void>(),
});

export const stepProps = () => ({
  description: anyType(),
  icon: anyType(),
  status: stringType<Status>(),
  disabled: booleanType(),
  title: anyType(),
  subTitle: anyType(),
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
  slots: Object as CustomSlotsType<{
    progressDot: any;
    default: any;
  }>,

  // emits: ['update:current', 'change'],
  setup(props, { attrs, slots, emit }) {
    const { prefixCls, direction: rtlDirection, configProvider } = useConfigInject('steps', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, token] = useToken();

    const screens = useBreakpoint();
    const direction = computed(() =>
      props.responsive && screens.value.xs ? 'vertical' : props.direction,
    );
    const iconPrefix = computed(() => configProvider.getPrefixCls('', props.iconPrefix));
    const handleChange = (current: number) => {
      emit('update:current', current);
      emit('change', current);
    };
    const isInline = computed(() => props.type === 'inline');
    const mergedPercent = computed(() => (isInline.value ? undefined : props.percent));
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

        const progressWidth =
          props.size === 'small' ? token.value.controlHeight : token.value.controlHeightLG;

        const iconWithProgress = (
          <div class={`${prefixCls.value}-progress-icon`}>
            <Progress
              type="circle"
              percent={mergedPercent.value}
              size={progressWidth}
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
    const icons = computed(() => ({
      finish: <CheckOutlined class={`${prefixCls.value}-finish-icon`} />,
      error: <CloseOutlined class={`${prefixCls.value}-error-icon`} />,
    }));
    return () => {
      const stepsClassName = classNames(
        {
          [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
          [`${prefixCls.value}-with-progress`]: mergedPercent.value !== undefined,
        },
        attrs.class,
        hashId.value,
      );
      const itemRender = (item: StepProps, stepItem: VueNode) =>
        item.description ? <Tooltip title={item.description}>{stepItem}</Tooltip> : stepItem;

      return wrapSSR(
        <VcSteps
          icons={icons.value}
          {...attrs}
          {...omit(props, ['percent', 'responsive'])}
          items={props.items}
          direction={direction.value}
          prefixCls={prefixCls.value}
          iconPrefix={iconPrefix.value}
          class={stepsClassName}
          onChange={handleChange}
          isInline={isInline.value}
          itemRender={isInline.value ? itemRender : undefined}
          v-slots={{ stepIcon: stepIconRender, ...slots }}
        />,
      );
    };
  },
});

/* istanbul ignore next */
export const Step = defineComponent({
  compatConfig: { MODE: 3 },
  ...(VcStep as any),
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
