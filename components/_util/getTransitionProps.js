const getTransitionProps = (transitionName, opt = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return { css: false, ...opt };
  }
  const transitionProps = {
    appear: true,
    appearFromClass: `${transitionName}-appear`,
    appearActiveClass: `${transitionName}-appear ${transitionName}-appear-active`,
    appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-enter`,
    enterActiveClass: `${transitionName}-enter ${transitionName}-enter-active`,
    enterToClass: `${transitionName}-enter ${transitionName}-enter-active`,
    leaveFormClass: ` ${transitionName}-leave`,
    leaveActiveClass: `${transitionName}-leave ${transitionName}-leave-active`,
    leaveToClass: `${transitionName}-leave ${transitionName}-leave-active`,
    ...opt,
  };
  return transitionProps;
};

export default getTransitionProps;
