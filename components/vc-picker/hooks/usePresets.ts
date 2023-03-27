import type { Ref, ComputedRef } from 'vue';
import { computed } from 'vue';

import warning from 'ant-design-vue/es/vc-util/warning';
import type { PresetDate } from '../interface';

export default function usePresets<T>(
  presets?: Ref<PresetDate<T>[]> | ComputedRef<PresetDate<T>[]>,
  legacyRanges?: Record<string, T | (() => T)>,
): Ref<PresetDate<T>[]> | ComputedRef<PresetDate<T>[]> {
  if (presets.value) {
    return presets;
  }
  if (legacyRanges) {
    warning(false, '`ranges` is deprecated. Please use `presets` instead.');

    const rangeLabels = Object.keys(legacyRanges);

    return computed(() =>
      rangeLabels.map(label => {
        const range = legacyRanges[label];
        const newValues = typeof range === 'function' ? (range as any)() : range;

        return {
          label,
          value: newValues,
        };
      }),
    );
  }
  return [] as unknown as ComputedRef<PresetDate<T>[]>;
}
