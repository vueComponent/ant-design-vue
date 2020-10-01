import cssAnimation from './css-animation';
import raf from 'raf';
import { nextTick } from 'vue';

function animate(node: HTMLElement, show: boolean, done: () => void) {
  let height: number;
  let requestAnimationFrameId: number;
  let appearRequestAnimationFrameId: number;
  return cssAnimation(node, 'ant-motion-collapse-legacy', {
    start() {
      if (appearRequestAnimationFrameId) {
        raf.cancel(appearRequestAnimationFrameId);
      }
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
        node.style.opacity = '1';
      } else {
        height = node.offsetHeight;
        // not get offsetHeight when appear
        // set it into raf get correct offsetHeight
        if (height === 0) {
          appearRequestAnimationFrameId = raf(() => {
            height = node.offsetHeight;
            node.style.height = '0px';
            node.style.opacity = '0';
          });
        } else {
          node.style.height = '0px';
          node.style.opacity = '0';
        }
      }
    },
    active() {
      if (requestAnimationFrameId) {
        raf.cancel(requestAnimationFrameId);
      }
      requestAnimationFrameId = raf(() => {
        node.style.height = `${show ? height : 0}px`;
        node.style.opacity = show ? '1' : '0';
      });
    },
    end() {
      if (appearRequestAnimationFrameId) {
        raf.cancel(appearRequestAnimationFrameId);
      }
      if (requestAnimationFrameId) {
        raf.cancel(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done && done();
    },
  });
}

const animation = {
  onEnter(node: HTMLElement, done: () => void) {
    nextTick(() => {
      animate(node, true, done);
    });
  },
  onLeave(node: HTMLElement, done: () => void) {
    return animate(node, false, done);
  },
};

export default animation;
