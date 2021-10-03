import type { Ref } from 'vue';
import { ref, onBeforeUnmount } from 'vue';
import wrapperRaf from '../../../_util/raf';

export default function useRaf<Callback extends Function>(callback: Callback) {
  const rafRef = ref<number>();
  const removedRef = ref(false);

  function trigger(...args: any[]) {
    if (!removedRef.value) {
      wrapperRaf.cancel(rafRef.value);
      rafRef.value = wrapperRaf(() => {
        callback(...args);
      });
    }
  }

  onBeforeUnmount(() => {
    removedRef.value = true;
    wrapperRaf.cancel(rafRef.value);
  });

  return trigger;
}

type Callback<T> = (ori: T) => T;

export function useRafState<T>(
  defaultState: T | (() => T),
): [Ref<T>, (updater: Callback<T>) => void] {
  const batchRef = ref<Callback<T>[]>([]);
  const state: Ref<T> = ref(
    typeof defaultState === 'function' ? (defaultState as any)() : defaultState,
  );

  const flushUpdate = useRaf(() => {
    let value = state.value;
    batchRef.value.forEach(callback => {
      value = callback(value);
    });
    batchRef.value = [];

    state.value = value;
  });

  function updater(callback: Callback<T>) {
    batchRef.value.push(callback);
    flushUpdate();
  }

  return [state, updater];
}
