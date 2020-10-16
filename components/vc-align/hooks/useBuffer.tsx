export default (callback: () => boolean, buffer: number) => {
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
      }, buffer);
    } else {
      cancelTrigger();
      timeout = window.setTimeout(() => {
        called = false;
        trigger();
      }, buffer);
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
