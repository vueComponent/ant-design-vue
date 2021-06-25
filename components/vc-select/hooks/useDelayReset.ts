import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';

/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */
export default function useDelayReset(
  timeout = 10,
): [Ref<Boolean>, (val: boolean, callback?: () => void) => void, () => void] {
  const bool = ref(false);
  let delay: number;

  const cancelLatest = () => {
    window.clearTimeout(delay);
  };

  onMounted(() => {
    cancelLatest();
  });
  const delaySetBool = (value: boolean, callback: () => void) => {
    cancelLatest();
    delay = window.setTimeout(() => {
      bool.value = value;
      if (callback) {
        callback();
      }
    }, timeout);
  };

  return [bool, delaySetBool, cancelLatest];
}
