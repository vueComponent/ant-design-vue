import { watch } from 'vue';

const SMOOTH_PTG = 14 / 15;

export default function useMobileTouchMove(inVirtual, listRef, callback) {
  let touched = false;
  let touchY = 0;

  let element = null;

  // Smooth scroll
  let interval = null;

  let cleanUpEvents;

  const onTouchMove = e => {
    if (touched) {
      const currentY = Math.ceil(e.touches[0].pageY);
      let offsetY = touchY - currentY;
      touchY = currentY;

      if (callback(offsetY)) {
        e.preventDefault();
      }

      // Smooth interval
      clearInterval(interval);
      interval = setInterval(() => {
        offsetY *= SMOOTH_PTG;

        if (!callback(offsetY, true) || Math.abs(offsetY) <= 0.1) {
          clearInterval(interval);
        }
      }, 16);
    }
  };

  const onTouchEnd = () => {
    touched = false;

    cleanUpEvents();
  };

  const onTouchStart = e => {
    cleanUpEvents();

    if (e.touches.length === 1 && !touched) {
      touched = true;
      touchY = Math.ceil(e.touches[0].pageY);

      element = e.target;
      element.addEventListener('touchmove', onTouchMove);
      element.addEventListener('touchend', onTouchEnd);
    }
  };

  cleanUpEvents = () => {
    if (element) {
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    }
  };
  watch(inVirtual, val => {
    listRef.current.removeEventListener('touchstart', onTouchStart);
    cleanUpEvents();
    clearInterval(interval);
    if (val.value) {
      listRef.current.addEventListener('touchstart', onTouchStart);
    }
  });
}
