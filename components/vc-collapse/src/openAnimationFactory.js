import cssAnimation from '../../_util/css-animation';

function animate(node, show, transitionName, done) {
  let height;
  return cssAnimation(node, transitionName, {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      done();
    },
  });
}

function animation(prefixCls) {
  return {
    enter(node, done) {
      return animate(node, true, `${prefixCls}-anim`, done);
    },
    leave(node, done) {
      return animate(node, false, `${prefixCls}-anim`, done);
    },
  };
}

export default animation;
