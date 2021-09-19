import type {
  BaseTransitionProps,
  CSSProperties,
  Ref,
  TransitionGroupProps,
  TransitionProps,
} from 'vue';
import {
  onUpdated,
  getCurrentInstance,
  defineComponent,
  nextTick,
  Transition as T,
  TransitionGroup as TG,
} from 'vue';

export const getTransitionProps = (transitionName: string, opt: TransitionProps = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return opt;
  }
  const transitionProps: TransitionProps = transitionName
    ? {
        appear: true,
        // type: 'animation',
        // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
        // appearActiveClass: `antdv-base-transtion`,
        // appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
        enterFromClass: `${transitionName}-enter ${transitionName}-enter-prepare`,
        // enterActiveClass: `${transitionName}-enter ${transitionName}-enter-active`,
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

let Transition = T;
let TransitionGroup = TG;

if (process.env.NODE_ENV === 'test') {
  Transition = defineComponent({
    name: 'TransitionForTest',
    inheritAttrs: false,
    setup(_props, { slots, attrs }) {
      const instance = getCurrentInstance();
      onUpdated(() => {
        const child = instance.subTree.children[0];
        if (child && child.dirs && child.dirs[0]) {
          const value = child.dirs[0].value;
          const oldValue = child.dirs[0].oldValue;
          if (!value && value !== oldValue) {
            nextTick(() => {
              if (attrs.onAfterLeave) {
                (attrs as any).onAfterLeave(instance.vnode.el);
              }
            });
          }
        }
      });
      return () => {
        return slots.default?.();
      };
    },
  }) as any;
  TransitionGroup = defineComponent({
    name: 'TransitionGroupForTest',
    inheritAttrs: false,
    props: ['tag', 'class'],
    setup(props, { slots }) {
      return () => {
        const { tag: Tag, ...rest } = props;
        const children = slots.default?.() || [];
        if (Tag) {
          return <Tag {...rest}>{children}</Tag>;
        } else {
          return children;
        }
      };
    },
  });
}

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

const collapseMotion = (style: Ref<CSSProperties>, className: Ref<string>): CSSMotionProps => {
  return {
    name: 'ant-motion-collapse',
    appear: true,
    css: true,
    onBeforeEnter: node => {
      className.value = 'ant-motion-collapse';
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
      className.value = 'ant-motion-collapse';
      style.value = getCurrentHeight(node);
    },
    onLeave: node => {
      window.setTimeout(() => {
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

export { Transition, TransitionGroup, collapseMotion, getTransitionName };

export default Transition;
