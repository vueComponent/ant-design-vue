import type { ComputedRef } from 'vue';
import { computed } from 'vue';

import warning from 'ant-design-vue/es/vc-util/warning';
import type { PresetDate } from '../interface';

export default function usePresets<T>(
  presets?: ComputedRef<PresetDate<T>[]>,
  legacyRanges?: ComputedRef<Record<string, T | (() => T)>>,
): ComputedRef<PresetDate<T>[]> {
  if (presets.value) {
    return presets;
  }
  if (legacyRanges && legacyRanges.value) {
    warning(false, '`ranges` is deprecated. Please use `presets` instead.');

    return computed(() => {
      const rangeLabels = Object.keys(legacyRanges.value);
      return rangeLabels.map(label => {
        const range = legacyRanges.value[label];
        const newValues = typeof range === 'function' ? (range as any)() : range;
        return {
          label,
          value: newValues,
        };
      });
    });
  }
  return [] as unknown as ComputedRef<PresetDate<T>[]>;
}
