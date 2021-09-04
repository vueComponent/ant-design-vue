import { ref, watch } from 'vue';

/**
 * Get sticky column offset width
 */
function useStickyOffsets(colWidths, columns) {
  const stickyOffsets = ref({
    left: [],
    right: [],
  });
  const columnCount = ref();
  watch(
    columns,
    () => {
      columnCount.value = columns.value.length;
    },
    { immediate: true },
  );
  watch([colWidths, columnCount], () => {
    const leftOffsets = [];
    const rightOffsets = [];
    let left = 0;
    let right = 0;

    for (let start = 0; start < columnCount.value; start += 1) {
      // Left offset
      leftOffsets[start] = left;
      left += colWidths.value[start] || 0;

      // Right offset
      const end = columnCount.value - start - 1;
      rightOffsets[end] = right;
      right += colWidths.value[end] || 0;
    }
    stickyOffsets.value = {
      left: leftOffsets,
      right: rightOffsets,
    };
  });
  return stickyOffsets;
}

export default useStickyOffsets;
