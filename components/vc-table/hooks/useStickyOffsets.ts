import type { ComputedRef, Ref } from 'vue';

import { computed } from 'vue';
import type { StickyOffsets } from '../interface';

/**
 * Get sticky column offset width
 */
function useStickyOffsets(
  colWidthsRef: Ref<number[]>,
  columnCountRef: Ref<number>,
  directionRef: Ref<'ltr' | 'rtl'>,
) {
  const stickyOffsets: ComputedRef<StickyOffsets> = computed(() => {
    const leftOffsets: number[] = [];
    const rightOffsets: number[] = [];
    let left = 0;
    let right = 0;

    const colWidths = colWidthsRef.value;
    const columnCount = columnCountRef.value;
    const direction = directionRef.value;

    for (let start = 0; start < columnCount; start += 1) {
      if (direction === 'rtl') {
        // Left offset
        rightOffsets[start] = right;
        right += colWidths[start] || 0;

        // Right offset
        const end = columnCount - start - 1;
        leftOffsets[end] = left;
        left += colWidths[end] || 0;
      } else {
        // Left offset
        leftOffsets[start] = left;
        left += colWidths[start] || 0;

        // Right offset
        const end = columnCount - start - 1;
        rightOffsets[end] = right;
        right += colWidths[end] || 0;
      }
    }

    return {
      left: leftOffsets,
      right: rightOffsets,
    };
  });

  return stickyOffsets;
}

export default useStickyOffsets;
