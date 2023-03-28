import type { Ref, UnwrapRef } from 'vue';
import { computed, ref, toRaw, unref, watch } from 'vue';

export default function useMergedState<T, R = Ref<T>>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: Ref<T> | Ref<UnwrapRef<T>>;
    onChange?: (val: T, prevValue: T) => void;
    postState?: (val: T) => T;
  },
): [R, (val: T) => void] {
  const { defaultValue, value = ref() } = option || {};
  let initValue: T =
    typeof defaultStateValue === 'function' ? (defaultStateValue as any)() : defaultStateValue;
  if (value.value !== undefined) {
    initValue = unref(value as any) as T;
  }
  if (defaultValue !== undefined) {
    initValue = typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue;
  }

  const innerValue = ref(initValue) as Ref<T>;
  const innerMergedValue = ref(initValue) as Ref<T>;
  const exposeValue = computed({
    get: () => {
      let val = innerValue.value;
      if (option.postState) {
        val = option.postState(val as T);
      }
      innerMergedValue.value = val as T;

      return innerMergedValue.value;
    },
    set: (val: T) => {
      triggerChange(val);
    },
  });

  function triggerChange(newValue: T) {
    const preVal = innerMergedValue.value;
    innerValue.value = newValue;
    if (toRaw(innerMergedValue.value) !== newValue && option.onChange) {
      option.onChange(newValue, preVal);
    }
  }

  // Effect of reset value to `undefined`
  watch(value, () => {
    innerValue.value = value.value as T;
  });

  return [exposeValue as unknown as R, triggerChange];
}
