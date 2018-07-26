
import getRequestAnimationFrame, { cancelRequestAnimationFrame as caf } from './getRequestAnimationFrame';
var raf = getRequestAnimationFrame();

export var cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return caf(frame.id);
};

export var requestAnimationTimeout = function requestAnimationTimeout(callback, delay) {
  var start = Date.now();
  function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf(timeout);
    }
  }

  var frame = {
    id: raf(timeout)
  };

  return frame;
};