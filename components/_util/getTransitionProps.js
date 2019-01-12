import animate from './css-animation';
const noop = () => {};
const getTransitionProps = (transitionName, opt = {}) => {
  const { beforeEnter, enter, afterEnter, leave, afterLeave, appear = true, tag } = opt;
  const transitionProps = {
    props: {
      appear,
      css: false,
    },
    on: {
      beforeEnter: beforeEnter || noop,
      enter:
        enter ||
        ((el, done) => {
          animate(el, `${transitionName}-enter`, done);
        }),
      afterEnter: afterEnter || noop,
      leave:
        leave ||
        ((el, done) => {
          animate(el, `${transitionName}-leave`, done);
        }),
      afterLeave: afterLeave || noop,
    },
  };
  // transition-group
  if (tag) {
    transitionProps.tag = tag;
  }
  return transitionProps;
};

export default getTransitionProps;
