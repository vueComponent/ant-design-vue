import cssAnimation from './css-animation';
import getRequestAnimationFrame, { cancelRequestAnimationFrame } from './getRequestAnimationFrame';

var reqAnimFrame = getRequestAnimationFrame();

function animate(node, show, done) {
  var height = void 0;
  var requestAnimationFrameId = void 0;
  return cssAnimation(node, 'ant-motion-collapse', {
    start: function start() {
      if (!show) {
        node.style.height = node.offsetHeight + 'px';
        node.style.opacity = 1;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
        node.style.opacity = 0;
      }
    },
    active: function active() {
      if (requestAnimationFrameId) {
        cancelRequestAnimationFrame(requestAnimationFrameId);
      }
      requestAnimationFrameId = reqAnimFrame(function () {
        node.style.height = (show ? height : 0) + 'px';
        node.style.opacity = show ? 1 : 0;
      });
    },
    end: function end() {
      if (requestAnimationFrameId) {
        cancelRequestAnimationFrame(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done();
    }
  });
}

var animation = {
  enter: function enter(node, done) {
    return animate(node, true, done);
  },
  leave: function leave(node, done) {
    return animate(node, false, done);
  }
};

export default animation;