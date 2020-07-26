import animate from './css-animation';
const getTransitionProps = (transitionName, opt = {}) => {
  const transitionProps = {
    appear: true,
    css: false,
    onEnter: (el, done) => {
      transitionName ? animate(el, `${transitionName}-enter`, done) : done();
    },
    onLeave: (el, done) => {
      transitionName ? animate(el, `${transitionName}-leave`, done) : done();
    },
    ...opt,
  };
  return transitionProps;
};

export default getTransitionProps;
