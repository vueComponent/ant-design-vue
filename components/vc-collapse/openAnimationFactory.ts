import cssAnimation from '../_util/css-animation';

function animate(node: HTMLElement, show: boolean, transitionName: string, done: () => void) {
  let height: number;
  return cssAnimation(node, transitionName, {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = '0px';
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

function animation(prefixCls: string) {
  return {
    onEnter(node: HTMLElement, done: () => void) {
      return animate(node, true, `${prefixCls}-anim`, done);
    },
    onLeave(node: HTMLElement, done: () => void) {
      return animate(node, false, `${prefixCls}-anim`, done);
    },
  };
}

export default animation;
