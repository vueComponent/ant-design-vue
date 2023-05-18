import PropTypes from '../_util/vue-types';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import type { VCStepProps } from './Step';
import Step from './Step';
import type { VueNode } from '../_util/type';
import { functionType, stringType } from '../_util/type';
import { filterEmpty } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import type { Status, StepIconRender } from './interface';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Steps',
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('vc-steps'),
    iconPrefix: PropTypes.string.def('vc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: stringType<Status>('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(undefined),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    items: PropTypes.array.def(() => []),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
    stepIcon: functionType<StepIconRender>(),
    isInline: PropTypes.looseBool,
    itemRender: functionType<(item: Record<string, any>, stepItem: VueNode) => VueNode>(),
  },
  emits: ['change'],
  setup(props, { slots, emit }) {
    const onStepClick = (next: number) => {
      const { current } = props;
      if (current !== next) {
        emit('change', next);
      }
    };
    const renderStep = (item: VCStepProps, index: number, legacyRender?: any) => {
      const {
        prefixCls,
        iconPrefix,
        status,
        current,
        initial,
        icons,
        stepIcon = slots.stepIcon,
        isInline,
        itemRender,
        progressDot = slots.progressDot,
      } = props;
      const mergedProgressDot = isInline || progressDot;
      const mergedItem = { ...item, class: '' };
      const stepNumber = initial + index;
      const commonProps = {
        active: stepNumber === current,
        stepNumber: stepNumber + 1,
        stepIndex: stepNumber,
        key: stepNumber,
        prefixCls,
        iconPrefix,
        progressDot: mergedProgressDot,
        stepIcon,
        icons,
        onStepClick,
      };
      // fix tail color
      if (status === 'error' && index === current - 1) {
        mergedItem.class = `${prefixCls}-next-error`;
      }

      if (!mergedItem.status) {
        if (stepNumber === current) {
          mergedItem.status = status;
        } else if (stepNumber < current) {
          mergedItem.status = 'finish';
        } else {
          mergedItem.status = 'wait';
        }
      }

      if (isInline) {
        mergedItem.icon = undefined;
        mergedItem.subTitle = undefined;
      }
      if (legacyRender) {
        return legacyRender({ ...mergedItem, ...commonProps });
      }
      if (itemRender) {
        mergedItem.itemRender = stepItem => itemRender(mergedItem, stepItem);
      }

      return <Step {...mergedItem} {...commonProps} __legacy={false} />;
    };
    const renderStepWithNode = (node: any, index: number) => {
      return renderStep({ ...node.props }, index, stepProps => {
        const stepNode = cloneElement(node, stepProps);
        return stepNode;
      });
    };
    return () => {
      const {
        prefixCls,
        direction,
        type,
        labelPlacement,
        iconPrefix,
        status,
        size,
        current,
        progressDot = slots.progressDot,
        initial,
        icons,
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

      return (
        <div class={classString} {...restProps}>
          {items.filter(item => item).map((item, index) => renderStep(item, index))}
          {filterEmpty(slots.default?.()).map(renderStepWithNode)}
        </div>
      );
    };
  },
});
