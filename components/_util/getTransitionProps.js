import animate from './css-animation';
const getTransitionProps = (transitionName, opt = {}) => {
  const transitionProps = {
    appear: true,
    css: false,
    onEnter: (el, done) => {
      animate(el, `${transitionName}-enter`, done);
    },
    onLeave: (el, done) => {
      animate(el, `${transitionName}-leave`, done);
    },
    ...opt,
  };
  return transitionProps;
};

export default getTransitionProps;
