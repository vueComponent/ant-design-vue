import type { Ref } from 'vue';
import raf from '../../_util/raf';
import isFF from '../utils/isFirefox';
import useOriginScroll from './useOriginScroll';

interface FireFoxDOMMouseScrollEvent {
  detail: number;
  preventDefault: Function;
}

export default function useFrameWheel(
  inVirtual: Ref<boolean>,
  isScrollAtTop: Ref<boolean>,
  isScrollAtBottom: Ref<boolean>,
  onWheelDelta: (offset: number) => void,
): [(e: WheelEvent) => void, (e: FireFoxDOMMouseScrollEvent) => void] {
  let offsetRef = 0;
  let nextFrame: number = null;

  // Firefox patch
  let wheelValue = null;
  let isMouseScroll = false;

  // Scroll status sync
  const originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);

  function onWheel(event: { preventDefault?: any; deltaY?: any }) {
    if (!inVirtual.value) return;

    raf.cancel(nextFrame!);

    const { deltaY } = event;
    offsetRef += deltaY;
    wheelValue = deltaY;

    // Do nothing when scroll at the edge, Skip check when is in scroll
    if (originScroll(deltaY)) return;

    // Proxy of scroll events
    if (!isFF) {
      event.preventDefault();
    }

    nextFrame = raf(() => {
      // Patch a multiple for Firefox to fix wheel number too small
      // ref: https://github.com/ant-design/ant-design/issues/26372#issuecomment-679460266
      const patchMultiple = isMouseScroll ? 10 : 1;
      onWheelDelta(offsetRef * patchMultiple);
      offsetRef = 0;
    });
  }

  // A patch for firefox
  function onFireFoxScroll(event: { detail: any }) {
    if (!inVirtual.value) return;

    isMouseScroll = event.detail === wheelValue;
  }

  return [onWheel, onFireFoxScroll];
}
