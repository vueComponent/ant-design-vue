import type { Ref } from 'vue';
import { computed, watchEffect } from 'vue';
import { updateCSS, removeCSS } from '../../vc-util/Dom/dynamicCSS';
import getScrollBarSize from '../../_util/getScrollBarSize';

const UNIQUE_ID = `vc-util-locker-${Date.now()}`;

let uuid = 0;

/**../vc-util/Dom/dynam
 * Test usage export. Do not use in your production
 */
export function isBodyOverflowing() {
  return (
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth
  );
}

export default function useScrollLocker(lock?: Ref<boolean>) {
  const mergedLock = computed(() => !!lock && !!lock.value);
  const id = computed(() => {
    uuid += 1;
    return `${UNIQUE_ID}_${uuid}`;
  });

  watchEffect(() => {
    if (mergedLock.value) {
      const scrollbarSize = getScrollBarSize();
      const isOverflow = isBodyOverflowing();

      updateCSS(
        `
html body {
  overflow-y: hidden;
  ${isOverflow ? `width: calc(100% - ${scrollbarSize}px);` : ''}
}`,
        id.value,
      );
    } else {
      removeCSS(id.value);
    }
  });
}
