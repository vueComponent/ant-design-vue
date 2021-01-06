import cssAnimation from './css-animation';
import { nextTick } from 'vue';

function animate(node, show, done) {
  let height;
  let requestAnimationFrameId;
  let appearRequestAnimationFrameId;
  return cssAnimation(node, 'ant-motion-collapse-legacy', {
    start() {
      if (appearRequestAnimationFrameId) {
        cancelAnimationFrame(appearRequestAnimationFrameId);
      }
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
        node.style.opacity = '1';
      } else {
        height = node.offsetHeight;
        // not get offsetHeight when appear
        // set it into raf get correct offsetHeight
        if (height === 0) {
          appearRequestAnimationFrameId = requestAnimationFrame(() => {
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
        cancelAnimationFrame(requestAnimationFrameId);
      }
      requestAnimationFrameId = requestAnimationFrame(() => {
        node.style.height = `${show ? height : 0}px`;
        node.style.opacity = show ? '1' : '0';
      });
    },
    end() {
      if (appearRequestAnimationFrameId) {
        cancelAnimationFrame(appearRequestAnimationFrameId);
      }
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done && done();
    },
  });
}

const animation = {
  onEnter(node, done) {
    nextTick(() => {
      animate(node, true, done);
    });
  },
  onLeave(node, done) {
    return animate(node, false, done);
  },
};

export default animation;
