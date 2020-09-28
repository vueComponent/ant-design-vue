import { reactive } from 'vue';

export default (isScrollAtTop, isScrollAtBottom) => {
  // Do lock for a wheel when scrolling
  let lock = false;
  let lockTimeout = null;
  function lockScroll() {
    clearTimeout(lockTimeout);

    lock = true;

    lockTimeout = setTimeout(() => {
      lock = false;
    }, 50);
  }

  // Pass to ref since global add is in closure
  const scrollPingRef = reactive({
    top: isScrollAtTop.value,
    bottom: isScrollAtBottom.value,
  });
  // scrollPingRef.value.top = isScrollAtTop;
  // scrollPingRef.value.bottom = isScrollAtBottom;

  return (deltaY, smoothOffset = false) => {
    const originScroll =
      // Pass origin wheel when on the top
      (deltaY < 0 && scrollPingRef.top) ||
      // Pass origin wheel when on the bottom
      (deltaY > 0 && scrollPingRef.bottom);

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
