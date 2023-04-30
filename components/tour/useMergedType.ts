import useMergedState from '../_util/hooks/useMergedState';
import type { TourProps } from './interface';
import type { Ref } from 'vue';
import { computed, watch } from 'vue';

interface Props {
  defaultType?: string;
  steps?: TourProps['steps'];
  current?: Ref<number>;
  defaultCurrent?: number;
}

/**
 * returns the merged type of a step or the default type.
 */
const useMergedType = ({ defaultType, steps = [], current, defaultCurrent }: Props) => {
  const [innerCurrent, updateInnerCurrent] = useMergedState<number | undefined>(defaultCurrent, {
    value: current,
  });

  watch(current, val => {
    if (val === undefined) return;
    updateInnerCurrent(val);
  });

  const innerType = computed(() => {
    return typeof innerCurrent.value === 'number' ? steps[innerCurrent.value]?.type : defaultType;
  });

  const currentMergedType = computed(() => innerType.value ?? defaultType);

  return { currentMergedType, updateInnerCurrent };
};

export default useMergedType;
