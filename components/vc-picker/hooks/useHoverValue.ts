import type { ComputedRef, Ref, UnwrapRef } from 'vue';
import { ref, onBeforeUnmount, watch } from 'vue';
import type { ValueTextConfig } from './useValueTexts';
import useValueTexts from './useValueTexts';

export default function useHoverValue<DateType>(
  valueText: Ref<string>,
  { formatList, generateConfig, locale }: ValueTextConfig<DateType>,
): [ComputedRef<string>, (date: DateType) => void, (immediately?: boolean) => void] {
  const innerValue = ref<DateType>(null);
  const raf = ref(null);

  function setValue(val: DateType, immediately = false) {
    cancelAnimationFrame(raf.value);
    if (immediately) {
      innerValue.value = val as UnwrapRef<DateType>;
      return;
    }
    raf.value = requestAnimationFrame(() => {
      innerValue.value = val as UnwrapRef<DateType>;
    });
  }

  const [, firstText] = useValueTexts(innerValue as Ref<DateType>, {
    formatList,
    generateConfig,
    locale,
  });
  function onEnter(date: DateType) {
    setValue(date);
  }

  function onLeave(immediately = false) {
    setValue(null, immediately);
  }

  watch(valueText, () => {
    onLeave(true);
  });
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf.value);
  });

  return [firstText, onEnter, onLeave];
}
