import supportsPassive from '../../_util/supportsPassive';
import type { Ref } from 'vue';
import { watch, onMounted } from 'vue';

const SMOOTH_PTG = 14 / 15;

export default function useMobileTouchMove(
  inVirtual: Ref<boolean>,
  listRef: Ref<HTMLDivElement | undefined>,
  callback: (offsetY: number, smoothOffset?: boolean) => boolean,
) {
  let touched = false;
  let touchY = 0;

  let element: HTMLElement | null = null;

  // Smooth scroll
  let interval: any = null;

  const cleanUpEvents = () => {
    if (element) {
      element.removeEventListener(
        'touchmove',
        onTouchMove,
        supportsPassive
          ? ({
              passive: false,
            } as EventListenerOptions)
          : false,
      );
      element.removeEventListener('touchend', onTouchEnd);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
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

  const onTouchStart = (e: TouchEvent) => {
    cleanUpEvents();

    if (e.touches.length === 1 && !touched) {
      touched = true;
      touchY = Math.ceil(e.touches[0].pageY);

      element = e.target as HTMLElement;
      element!.addEventListener(
        'touchmove',
        onTouchMove,
        supportsPassive
          ? ({
              passive: false,
            } as EventListenerOptions)
          : false,
      );
      element!.addEventListener('touchend', onTouchEnd);
    }
  };

  onMounted(() => {
    watch(
      inVirtual,
      val => {
        listRef.value.removeEventListener(
          'touchstart',
          onTouchStart,
          supportsPassive
            ? ({
                passive: false,
              } as EventListenerOptions)
            : false,
        );
        cleanUpEvents();
        clearInterval(interval);
        if (val) {
          listRef.value.addEventListener(
            'touchstart',
            onTouchStart,
            supportsPassive
              ? ({
                  passive: false,
                } as EventListenerOptions)
              : false,
          );
        }
      },
      { immediate: true },
    );
  });
}
