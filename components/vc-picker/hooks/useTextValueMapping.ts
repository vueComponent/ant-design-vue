import type { ComputedRef, Ref } from 'vue';
import { ref, watch } from 'vue';

export default function useTextValueMapping({
  valueTexts,
  onTextChange,
}: {
  /** Must useMemo, to assume that `valueTexts` only match on the first change */
  valueTexts: ComputedRef<string[]>;
  onTextChange: (text: string) => void;
}): [Ref<string>, (text: string) => void, () => void] {
  const text = ref('');

  function triggerTextChange(value: string) {
    text.value = value;
    onTextChange(value);
  }

  function resetText() {
    text.value = valueTexts.value[0];
  }

  watch(
    () => [...valueTexts.value],
    (cur, pre = []) => {
      if (
        cur.join('||') !== pre.join('||') &&
        valueTexts.value.every(valText => valText !== text.value)
      ) {
        resetText();
      }
    },
    { immediate: true },
  );

  return [text, triggerTextChange, resetText];
}
