import cssAnimation from './css-animation';
import raf from 'raf';
import Vue from 'vue';

function animate(node, show, done) {
  let height;
  let requestAnimationFrameId;
  let appearRequestAnimationFrameId;
  return cssAnimation(node, 'ant-motion-collapse', {
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
  enter(node, done) {
    Vue.nextTick(() => {
      animate(node, true, done);
    });
  },
  leave(node, done) {
    return animate(node, false, done);
  },
};

export default animation;
