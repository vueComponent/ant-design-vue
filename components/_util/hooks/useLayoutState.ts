import type { Ref } from 'vue';
import { onBeforeUnmount, ref } from 'vue';
import wrapperRaf from '../raf';

export type Updater<State> = (prev: State) => State;
/**
 * Execute code before next frame but async
 */
export function useLayoutState<State>(
  defaultState: State,
): [Ref<State>, (updater: Updater<State>) => void] {
  const stateRef = ref(defaultState);
  let tempState = stateRef.value;

  let updateBatchRef = [];
  const rafRef = ref();
  function setFrameState(updater: Updater<State>) {
    wrapperRaf.cancel(rafRef.value);
    updateBatchRef.push(updater);

    rafRef.value = wrapperRaf(() => {
      const prevBatch = updateBatchRef;
      // const prevState = stateRef.value;
      updateBatchRef = [];

      prevBatch.forEach(batchUpdater => {
        tempState = batchUpdater(tempState);
      });

      // if (tempState !== stateRef.value) {
      stateRef.value = tempState;
      // }
    });
  }

  onBeforeUnmount(() => {
    wrapperRaf.cancel(rafRef.value);
  });

  return [stateRef as Ref<State>, setFrameState];
}
