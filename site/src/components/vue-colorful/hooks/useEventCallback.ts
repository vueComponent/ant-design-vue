import { ref } from 'vue';

// Saves incoming handler to the ref in order to avoid "useCallback hell"
export function useEventCallback<T>(handler?: (value: T) => void): (value: T) => void {
  const callbackRef = ref(handler);
  const fn = ref((value: T) => {
    callbackRef.value && callbackRef.value(value);
  });
  callbackRef.value = handler;

  return fn.value;
}
