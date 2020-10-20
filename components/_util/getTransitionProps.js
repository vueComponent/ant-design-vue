const getTransitionProps = (transitionName, opt = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return { css: false, ...opt };
  }
  const transitionProps = transitionName ? {
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
  }: { css: false, ...opt };
  return transitionProps;
};

export default getTransitionProps;
