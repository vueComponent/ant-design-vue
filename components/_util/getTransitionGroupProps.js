// import animate from './css-animation';
const getTransitionGroupProps = (transitionName, opt = {}) => {
  if (process.env.NODE_ENV === 'test') {
    return { css: false, ...opt };
  }
  const transitionProps = {
    appear: true,
    appearFromClass: `${transitionName}-appear`,
    appearActiveClass: `${transitionName}`,
    appearToClass: `${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-appear ${transitionName}-enter`,
    enterActiveClass: `${transitionName}`,
    enterToClass: `${transitionName}-appear-active ${transitionName}-enter-active`,
    leaveActiveClass: `${transitionName} ${transitionName}-leave`,
    leaveToClass: `${transitionName}-leave-active`,
    ...opt,
  };
  return transitionProps;
};

export default getTransitionGroupProps;
