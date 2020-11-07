import { defineComponent, nextTick, Transition as T, TransitionGroup as TG } from 'vue';
import { findDOMNode } from './props-util';

export const getTransitionProps = (transitionName: string, opt: object = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return opt;
  }
  const transitionProps = transitionName
    ? {
        appear: true,
        appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
        // appearActiveClass: `antdv-base-transtion`,
        appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
        enterFromClass: `${transitionName}-enter ${transitionName}-enter-prepare`,
        // enterActiveClass: `antdv-base-transtion`,
        enterToClass: `${transitionName}-enter ${transitionName}-enter-active`,
        leaveFromClass: ` ${transitionName}-leave`,
        leaveActiveClass: `${transitionName}-leave ${transitionName}-leave-active`,
        leaveToClass: `${transitionName}-leave ${transitionName}-leave-active`,
        ...opt,
      }
    : { css: false, ...opt };
  return transitionProps;
};

export const getTransitionGroupProps = (transitionName: string, opt: object = {}) => {
  const transitionProps = transitionName
    ? {
        appear: true,
        appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
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
  Transition = (props, { slots }) => {
    const child = slots.default?.()[0];
    if (child && child.dirs && child.dirs[0]) {
      const value = child.dirs[0].value;
      const oldValue = child.dirs[0].oldValue;
      if (!value && value !== oldValue) {
        nextTick(() => {
          if (props.onAfterLeave) {
            props.onAfterLeave(findDOMNode(this));
          }
        });
      }
    }
    return slots.default?.();
  };
  Transition.displayName = 'TransitionForTest';
  Transition.inheritAttrs = false;
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

export { Transition, TransitionGroup };

export default Transition;
