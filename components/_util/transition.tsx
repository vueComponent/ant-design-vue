import type {
  BaseTransitionProps,
  CSSProperties,
  Ref,
  TransitionGroupProps,
  TransitionProps,
} from 'vue';
import { nextTick } from 'vue';
import { tuple } from './type';

const SelectPlacements = tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight');
export type SelectCommonPlacement = (typeof SelectPlacements)[number];

const getTransitionDirection = (placement: SelectCommonPlacement | undefined) => {
  if (placement !== undefined && (placement === 'topLeft' || placement === 'topRight')) {
    return `slide-down`;
  }
  return `slide-up`;
};

export const getTransitionProps = (transitionName: string, opt: TransitionProps = {}) => {
  const transitionProps: TransitionProps = transitionName
    ? {
        name: transitionName,
        appear: true,
        // type: 'animation',
        // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
        // appearActiveClass: `antdv-base-transtion`,
        // appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
        enterFromClass: `${transitionName}-enter ${transitionName}-enter-prepare ${transitionName}-enter-start`,
        enterActiveClass: `${transitionName}-enter ${transitionName}-enter-prepare`,
        enterToClass: `${transitionName}-enter ${transitionName}-enter-active`,
        leaveFromClass: ` ${transitionName}-leave`,
        leaveActiveClass: `${transitionName}-leave ${transitionName}-leave-active`,
        leaveToClass: `${transitionName}-leave ${transitionName}-leave-active`,
        ...opt,
      }
    : { css: false, ...opt };
  return transitionProps;
};

export const getTransitionGroupProps = (transitionName: string, opt: TransitionProps = {}) => {
  const transitionProps: TransitionGroupProps = transitionName
    ? {
        name: transitionName,
        appear: true,
        // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
        appearActiveClass: `${transitionName}`,
        appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
        enterFromClass: `${transitionName}-appear ${transitionName}-enter ${transitionName}-appear-prepare ${transitionName}-enter-prepare`,
        enterActiveClass: `${transitionName}`,
        enterToClass: `${transitionName}-enter ${transitionName}-appear ${transitionName}-appear-active ${transitionName}-enter-active`,
        leaveActiveClass: `${transitionName} ${transitionName}-leave`,
        leaveToClass: `${transitionName}-leave-active`,
        ...opt,
      }
    : { css: false, ...opt };
  return transitionProps;
};

export declare type MotionEvent = (TransitionEvent | AnimationEvent) & {
  deadline?: boolean;
};

export declare type MotionEventHandler = (element: Element, done?: () => void) => CSSProperties;

export declare type MotionEndEventHandler = (element: Element, done?: () => void) => boolean | void;

// ================== Collapse Motion ==================
const getCollapsedHeight: MotionEventHandler = () => ({ height: 0, opacity: 0 });
const getRealHeight: MotionEventHandler = node => ({
  height: `${node.scrollHeight}px`,
  opacity: 1,
});
const getCurrentHeight: MotionEventHandler = (node: any) => ({ height: `${node.offsetHeight}px` });
// const skipOpacityTransition: MotionEndEventHandler = (_, event) =>
//   (event as TransitionEvent).propertyName === 'height';

export interface CSSMotionProps extends Partial<BaseTransitionProps<Element>> {
  name?: string;
  css?: boolean;
}

const collapseMotion = (
  name = 'ant-motion-collapse',
  style: Ref<CSSProperties>,
  className: Ref<string>,
): CSSMotionProps => {
  return {
    name,
    appear: true,
    css: true,
    onBeforeEnter: node => {
      className.value = name;
      style.value = getCollapsedHeight(node);
    },
    onEnter: node => {
      nextTick(() => {
        style.value = getRealHeight(node);
      });
    },
    onAfterEnter: () => {
      className.value = '';
      style.value = {};
    },
    onBeforeLeave: node => {
      className.value = name;
      style.value = getCurrentHeight(node);
    },
    onLeave: node => {
      setTimeout(() => {
        style.value = getCollapsedHeight(node);
      });
    },
    onAfterLeave: () => {
      className.value = '';
      style.value = {};
    },
  };
};

const getTransitionName = (rootPrefixCls: string, motion: string, transitionName?: string) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};

export { collapseMotion, getTransitionName, getTransitionDirection };
