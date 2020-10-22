import { defineComponent, Fragment, Transition as T, TransitionGroup as TG } from 'vue';

export const getTransitionProps = (transitionName: string, opt: object = {}) => {
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
  Transition = (_, { slots }) => {
    return slots.default?.();
  };
  TransitionGroup = defineComponent({
    props: ['tag', 'class'],
    setup(props, { slots }) {
      const { tag: Tag = Fragment, ...rest } = props;
      return () => {
        return <Tag {...rest}>{slots.default?.()}</Tag>;
      };
    },
  });
}

export { Transition, TransitionGroup };

export default Transition;
