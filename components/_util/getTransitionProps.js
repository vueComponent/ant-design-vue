const getTransitionProps = (transitionName, opt = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return { css: false, ...opt };
  }
  const transitionProps = {
    appear: true,
    appearFromClass: `${transitionName}-appear`,
    // appearActiveClass: `antdv-base-transtion`,
    appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-enter`,
    // enterActiveClass: `antdv-base-transtion`,
    enterToClass: `${transitionName}-enter ${transitionName}-enter-active`,
    leaveFromClass: ` ${transitionName}-leave`,
    leaveActiveClass: `${transitionName}-leave ${transitionName}-leave-active`,
    leaveToClass: `${transitionName}-leave ${transitionName}-leave-active`,
    ...opt,
  };
  return transitionProps;
};

export default getTransitionProps;
