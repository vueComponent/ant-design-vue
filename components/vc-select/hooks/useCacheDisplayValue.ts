import type { ComputedRef, Ref } from 'vue';
import { computed } from 'vue';
import type { DisplayLabelValueType } from '../interface/generator';

export default function useCacheDisplayValue(
  values: Ref<DisplayLabelValueType[]>,
): ComputedRef<DisplayLabelValueType[]> {
  let prevValues = [...values.value];

  const mergedValues = computed(() => {
    // Create value - label map
    const valueLabels = new Map();
    prevValues.forEach(({ value, label }) => {
      if (value !== label) {
        valueLabels.set(value, label);
      }
    });

    const resultValues = values.value.map(item => {
      const cacheLabel = valueLabels.get(item.value);
      if (item.isCacheable && cacheLabel) {
        return {
          ...item,
          label: cacheLabel,
        };
      }

      return item;
    });

    prevValues = resultValues;
    return resultValues;
  });

  return mergedValues;
}
