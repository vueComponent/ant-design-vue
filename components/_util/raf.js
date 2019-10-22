import raf from 'raf';

let id = 0;
const ids = {};

// Support call raf with delay specified frame
export default function wrapperRaf(callback, delayFrames = 1) {
  const myId = id++;
  let restFrames = delayFrames;

  function internalCallback() {
    restFrames -= 1;

    if (restFrames <= 0) {
      callback();
      delete ids[id];
    } else {
      ids[id] = raf(internalCallback);
    }
  }

  ids[id] = raf(internalCallback);

  return myId;
}

wrapperRaf.cancel = function(pid) {
  raf.cancel(ids[pid]);
  delete ids[pid];
};
