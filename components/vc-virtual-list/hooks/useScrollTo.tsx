import type { ShallowRef, Ref } from 'vue';
import raf from '../../_util/raf';
import type { GetKey } from '../interface';
import type { CacheMap } from './useHeights';

export default function useScrollTo(
  containerRef: Ref<Element | undefined>,
  mergedData: ShallowRef<any[]>,
  heights: CacheMap,
  props,
  getKey: GetKey,
  collectHeight: () => void,
  syncScrollTop: (newTop: number) => void,
  triggerFlash: () => void,
) {
  let scroll: number;

  return (arg?: any) => {
    // When not argument provided, we think dev may want to show the scrollbar
    if (arg === null || arg === undefined) {
      triggerFlash();
      return;
    }

    // Normal scroll logic
    raf.cancel(scroll!);
    const data = mergedData.value;
    const itemHeight = props.itemHeight;
    if (typeof arg === 'number') {
      syncScrollTop(arg);
    } else if (arg && typeof arg === 'object') {
      let index: number;
      const { align } = arg;

      if ('index' in arg) {
        ({ index } = arg);
      } else {
        index = data.findIndex((item: object) => getKey(item) === arg.key);
      }

      const { offset = 0 } = arg;

      // We will retry 3 times in case dynamic height shaking
      const syncScroll = (times: number, targetAlign?: 'top' | 'bottom') => {
        if (times < 0 || !containerRef.value) return;

        const height = containerRef.value.clientHeight;
        let needCollectHeight = false;
        let newTargetAlign = targetAlign;

        // Go to next frame if height not exist
        if (height) {
          const mergedAlign = targetAlign || align;

          // Get top & bottom
          let stackTop = 0;
          let itemTop = 0;
          let itemBottom = 0;

          const maxLen = Math.min(data.length, index);
          for (let i = 0; i <= maxLen; i += 1) {
            const key = getKey(data[i]);
            itemTop = stackTop;
            const cacheHeight = heights.get(key);
            itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);

            stackTop = itemBottom;

            if (i === index && cacheHeight === undefined) {
              needCollectHeight = true;
            }
          }
          const scrollTop = containerRef.value.scrollTop;
          // Scroll to
          let targetTop: number | null = null;

          switch (mergedAlign) {
            case 'top':
              targetTop = itemTop - offset;
              break;
            case 'bottom':
              targetTop = itemBottom - height + offset;
              break;

            default: {
              const scrollBottom = scrollTop + height;
              if (itemTop < scrollTop) {
                newTargetAlign = 'top';
              } else if (itemBottom > scrollBottom) {
                newTargetAlign = 'bottom';
              }
            }
          }

          if (targetTop !== null && targetTop !== scrollTop) {
            syncScrollTop(targetTop);
          }
        }

        // We will retry since element may not sync height as it described
        scroll = raf(() => {
          if (needCollectHeight) {
            collectHeight();
          }
          syncScroll(times - 1, newTargetAlign);
        }, 2);
      };

      syncScroll(5);
    }
  };
}
