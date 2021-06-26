import type { Ref } from 'vue';

export default (isScrollAtTop: Ref<boolean>, isScrollAtBottom: Ref<boolean>) => {
  // Do lock for a wheel when scrolling
  let lock = false;
  let lockTimeout: any = null;
  function lockScroll() {
    clearTimeout(lockTimeout);

    lock = true;

    lockTimeout = setTimeout(() => {
      lock = false;
    }, 50);
  }
  return (deltaY: number, smoothOffset = false) => {
    const originScroll =
      // Pass origin wheel when on the top
      (deltaY < 0 && isScrollAtTop.value) ||
      // Pass origin wheel when on the bottom
      (deltaY > 0 && isScrollAtBottom.value);

    if (smoothOffset && originScroll) {
      // No need lock anymore when it's smooth offset from touchMove interval
      clearTimeout(lockTimeout);
      lock = false;
    } else if (!originScroll || lock) {
      lockScroll();
    }

    return !lock && originScroll;
  };
};
