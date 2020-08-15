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
      delete ids[myId];
    } else {
      ids[myId] = raf(internalCallback);
    }
  }

  ids[myId] = raf(internalCallback);

  return myId;
}

wrapperRaf.cancel = function(pid) {
  if (pid === undefined) return;
  raf.cancel(ids[pid]);
  delete ids[pid];
};
wrapperRaf.ids = ids; // export this for test usage
