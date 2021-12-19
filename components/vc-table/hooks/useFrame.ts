import raf from '../../_util/raf';
import type { Ref, UnwrapRef } from 'vue';
import { onBeforeUnmount, ref, shallowRef } from 'vue';

export type Updater<State> = (prev: State) => State;

export function useLayoutState<State>(
  defaultState: State,
): [Ref<State>, (updater: Updater<State>) => void] {
  const stateRef = shallowRef<State>(defaultState);
  let rafId: number;
  const updateBatchRef = shallowRef<Updater<State>[]>([]);
  function setFrameState(updater: Updater<State>) {
    updateBatchRef.value.push(updater);
    raf.cancel(rafId);
    rafId = raf(() => {
      const prevBatch = updateBatchRef.value;
      // const prevState = stateRef.value;
      updateBatchRef.value = [];
      prevBatch.forEach(batchUpdater => {
        stateRef.value = batchUpdater(stateRef.value as State);
      });
    });
  }
  onBeforeUnmount(() => {
    raf.cancel(rafId);
  });

  return [stateRef as Ref<State>, setFrameState];
}

/** Lock frame, when frame pass reset the lock. */
export function useTimeoutLock<State>(
  defaultState?: State,
): [(state: UnwrapRef<State>) => void, () => UnwrapRef<State> | null] {
  const frameRef = ref<State | null>(defaultState || null);
  const timeoutRef = ref<any>();

  function cleanUp() {
    clearTimeout(timeoutRef.value);
  }

  function setState(newState: UnwrapRef<State>) {
    frameRef.value = newState;
    cleanUp();

    timeoutRef.value = setTimeout(() => {
      frameRef.value = null;
      timeoutRef.value = undefined;
    }, 100);
  }

  function getState() {
    return frameRef.value;
  }

  onBeforeUnmount(() => {
    cleanUp();
  });

  return [setState, getState];
}
