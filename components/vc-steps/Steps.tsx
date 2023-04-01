import PropTypes from '../_util/vue-types';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Step from './Step';
import { cloneElement } from '../_util/vnode';
import { filterEmpty } from '../_util/props-util';
export type Status = 'error' | 'process' | 'finish' | 'wait';
export type StepIconRender = (info: {
  index: number;
  status: Status;
  title: any;
  description: any;
  node: any;
}) => any;

export type ProgressDotRender = (info: {
  iconDot: any;
  index: number;
  status: Status;
  title: any;
  description: any;
}) => any;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Steps',
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('vc-steps'),
    iconPrefix: PropTypes.string.def('vc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(undefined),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    items: PropTypes.array.def(() => []),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
    style: PropTypes.style,
    stepIcon: Function,
    isInline: PropTypes.looseBool,
    itemRender: Function,
  },
  slots: ['stepIcon', 'progressDot'],
  emits: ['change'],
  setup(props, { slots, emit }) {
    const onStepClick = next => {
      const { current } = props;
      if (current !== next) {
        emit('change', next);
      }
    };
    return () => {
      const {
        prefixCls,
        direction,
        style = {},
        type,
        labelPlacement,
        iconPrefix,
        status,
        size,
        current,
        progressDot = slots.progressDot,
        initial,
        icons,
        stepIcon = slots.stepIcon,
        items,
        isInline,
        itemRender,
        ...restProps
      } = props;
      const isNav = type === 'navigation';
      const mergedProgressDot = isInline || progressDot;
      const mergedDirection = isInline ? 'horizontal' : direction;
      const mergedSize = isInline ? undefined : size;

      const adjustedLabelPlacement = mergedProgressDot ? 'vertical' : labelPlacement;
      const classString = classNames(prefixCls, `${prefixCls}-${direction}`, {
        [`${prefixCls}-${mergedSize}`]: mergedSize,
        [`${prefixCls}-label-${adjustedLabelPlacement}`]: mergedDirection === 'horizontal',
        [`${prefixCls}-dot`]: !!mergedProgressDot,
        [`${prefixCls}-navigation`]: isNav,
        [`${prefixCls}-inline`]: isInline,
      });
      const renderStep = (props, index, render) => {
        const { prefixCls: pre = prefixCls, ...restProps } = props || {};
        const stepNumber = initial + index;
        const stepProps = {
          ...restProps,
          stepNumber: stepNumber + 1,
          stepIndex: stepNumber,
          key: stepNumber,
          prefixCls: pre,
          iconPrefix,
          progressDot: mergedProgressDot,
          icons,
          stepIcon,
          onStepClick,
          active: stepNumber === current,
        };

        // fix tail color
        if (status === 'error' && index === current - 1) {
          stepProps.class = `${prefixCls}-next-error`;
        }

        if (!restProps.status) {
          if (stepNumber === current) {
            stepProps.status = status;
          } else if (stepNumber < current) {
            stepProps.status = 'finish';
          } else {
            stepProps.status = 'wait';
          }
        }

        if (isInline) {
          stepProps.icon = undefined;
          stepProps.subTitle = undefined;
        }
        stepProps.active = stepNumber === current;
        return render(stepProps);
      };
      const renderStepWithNode = (node, index) => {
        return renderStep({ ...node.props }, index, stepProps => {
          const stepNode = cloneElement(node, stepProps);
          if (itemRender) {
            return itemRender(stepProps, stepNode);
          }
          return stepNode;
        });
      };
      const renderStepWithItem = (item, index) => {
        return renderStep(item, index, stepProps => {
          const stepNode = <Step {...stepProps} />;
          if (itemRender) {
            return itemRender(stepProps, stepNode);
          }
          return stepNode;
        });
      };
      return (
        <div class={classString} style={style} {...restProps}>
          {items.length
            ? items.map(renderStepWithItem)
            : filterEmpty(slots.default?.()).map(renderStepWithNode)}
        </div>
      );
    };
  },
});
