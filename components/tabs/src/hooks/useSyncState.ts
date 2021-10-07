import type { Ref } from 'vue';
import { ref } from 'vue';

type Updater<T> = (prev: T) => T;

export default function useSyncState<T>(
  defaultState: T,
  onChange: (newValue: T, prevValue: T) => void,
): [Ref<T>, (updater: T | Updater<T>) => void] {
  const stateRef = ref(defaultState);

  function setState(updater: any) {
    const newValue = typeof updater === 'function' ? updater(stateRef.value) : updater;
    if (newValue !== stateRef.value) {
      onChange(newValue, stateRef.value as T);
    }
    stateRef.value = newValue;
  }

  return [stateRef as Ref<T>, setState];
}
