import getRequestAnimationFrame, { cancelRequestAnimationFrame } from './getRequestAnimationFrame';

const oriRaf = getRequestAnimationFrame();

export type RafFrame = {
  id: number;
};
// Support call raf with delay specified frame
export default function raf(callback: () => void, delayFrames = 1): { id: number } {
  let restFrames: number = delayFrames;

  function internalCallback() {
    restFrames -= 1;

    if (restFrames <= 0) {
      callback();
    } else {
      frame.id = oriRaf(internalCallback);
    }
  }

  const frame = {
    id: oriRaf(internalCallback),
  };

  return frame;
}

raf.cancel = function cancel(frame?: { id: number }) {
  if (!frame) return;

  cancelRequestAnimationFrame(frame.id);
};
