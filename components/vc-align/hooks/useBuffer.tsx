import type { ComputedRef } from 'vue';

export default (callback: () => boolean, buffer: ComputedRef<number>) => {
  let called = false;
  let timeout = null;

  function cancelTrigger() {
    window.clearTimeout(timeout);
  }

  function trigger(force?: boolean) {
    if (!called || force === true) {
      if (callback() === false) {
        // Not delay since callback cancelled self
        return;
      }

      called = true;
      cancelTrigger();
      timeout = window.setTimeout(() => {
        called = false;
      }, buffer.value);
    } else {
      cancelTrigger();
      timeout = window.setTimeout(() => {
        called = false;
        trigger();
      }, buffer.value);
    }
  }

  return [
    trigger,
    () => {
      called = false;
      cancelTrigger();
    },
  ];
};
