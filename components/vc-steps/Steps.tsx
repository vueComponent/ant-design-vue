import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';

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
  name: 'Steps',
  props: {
    type: PropTypes.string.def('default'),
    prefixCls: PropTypes.string.def('vc-steps'),
    iconPrefix: PropTypes.string.def('vc'),
    direction: PropTypes.string.def('horizontal'),
    labelPlacement: PropTypes.string.def('horizontal'),
    status: PropTypes.string.def('process'),
    size: PropTypes.string.def(''),
    progressDot: PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func]).def(false),
    initial: PropTypes.number.def(0),
    current: PropTypes.number.def(0),
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any,
    }).loose,
    stepIcon: PropTypes.func,
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
      } = props;
      const isNav = type === 'navigation';
      const adjustedLabelPlacement = progressDot ? 'vertical' : labelPlacement;
      const classString = classNames(prefixCls, `${prefixCls}-${direction}`, {
        [`${prefixCls}-${size}`]: size,
        [`${prefixCls}-label-${adjustedLabelPlacement}`]: direction === 'horizontal',
        [`${prefixCls}-dot`]: !!progressDot,
        [`${prefixCls}-navigation`]: isNav,
      });
      const children = filterEmpty(slots.default?.());
      return (
        <div class={classString}>
          {children.map((child, index) => {
            // description: PropTypes.any,
            // icon: PropTypes.any,
            // status: PropTypes.oneOf(tuple('wait', 'process', 'finish', 'error')),
            // disabled: PropTypes.looseBool,
            // title: PropTypes.any,
            // subTitle: PropTypes.any,
            const { prefixCls: pre = prefixCls, ...restProps } = child.props || {};
            const stepNumber = initial + index;
            const stepProps = {
              ...restProps,
              stepNumber: stepNumber + 1,
              stepIndex: stepNumber,
              key: stepNumber,
              prefixCls: pre,
              iconPrefix,
              progressDot,
              icons,
              stepIcon,
              onStepClick,
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
            stepProps.active = stepNumber === current;
            return cloneElement(child, stepProps);
          })}
        </div>
      );
    };
  },
});
