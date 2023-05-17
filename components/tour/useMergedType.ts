import type { TourProps } from './interface';
import type { Ref } from 'vue';
import { ref, computed, watch } from 'vue';

interface Props {
  defaultType?: Ref<string>;
  steps?: Ref<TourProps['steps']>;
  current?: Ref<number>;
  defaultCurrent?: Ref<number>;
}
/**
 * returns the merged type of a step or the default type.
 */
const useMergedType = ({ defaultType, steps, current, defaultCurrent }: Props) => {
  const innerCurrent = ref(defaultCurrent?.value);
  const mergedCurrent = computed(() => current?.value);
  watch(
    mergedCurrent,
    val => {
      innerCurrent.value = val ?? defaultCurrent?.value;
    },
    { immediate: true },
  );
  const updateInnerCurrent = (val: number) => {
    innerCurrent.value = val;
  };
  const innerType = computed(() => {
    return typeof innerCurrent.value === 'number'
      ? steps && steps.value?.[innerCurrent.value]?.type
      : defaultType?.value;
  });

  const currentMergedType = computed(() => innerType.value ?? defaultType?.value);

  return { currentMergedType, updateInnerCurrent };
};

export default useMergedType;
