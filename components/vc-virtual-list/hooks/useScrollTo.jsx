/* eslint-disable no-param-reassign */

import raf from '../../_util/raf';

export default function useScrollTo(
  containerRef,
  state,
  heights,
  props,
  getKey,
  collectHeight,
  syncScrollTop,
) {
  let scroll = null;

  return arg => {
    raf.cancel(scroll);
    const data = state.mergedData;
    const itemHeight = props.itemHeight;
    if (typeof arg === 'number') {
      syncScrollTop(arg);
    } else if (arg && typeof arg === 'object') {
      let index;
      const { align } = arg;

      if ('index' in arg) {
        ({ index } = arg);
      } else {
        index = data.findIndex(item => getKey(item) === arg.key);
      }

      const { offset = 0 } = arg;

      // We will retry 3 times in case dynamic height shaking
      const syncScroll = (times, targetAlign) => {
        if (times < 0 || !containerRef.current) return;

        const height = containerRef.current.clientHeight;
        let needCollectHeight = false;
        let newTargetAlign = targetAlign;

        // Go to next frame if height not exist
        if (height) {
          const mergedAlign = targetAlign || align;

          // Get top & bottom
          let stackTop = 0;
          let itemTop = 0;
          let itemBottom = 0;

          for (let i = 0; i <= index; i += 1) {
            const key = getKey(data[i]);
            itemTop = stackTop;
            const cacheHeight = heights[key];
            itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);

            stackTop = itemBottom;

            if (i === index && cacheHeight === undefined) {
              needCollectHeight = true;
            }
          }

          // Scroll to
          let targetTop = null;

          switch (mergedAlign) {
            case 'top':
              targetTop = itemTop - offset;
              break;
            case 'bottom':
              targetTop = itemBottom - height + offset;
              break;

            default: {
              const { scrollTop } = containerRef.current;
              const scrollBottom = scrollTop + height;
              if (itemTop < scrollTop) {
                newTargetAlign = 'top';
              } else if (itemBottom > scrollBottom) {
                newTargetAlign = 'bottom';
              }
            }
          }

          if (targetTop !== null && targetTop !== containerRef.current.scrollTop) {
            syncScrollTop(targetTop);
          }
        }

        // We will retry since element may not sync height as it described
        scroll = raf(() => {
          if (needCollectHeight) {
            collectHeight();
          }
          syncScroll(times - 1, newTargetAlign);
        });
      };

      syncScroll(3);
    }
  };
}
