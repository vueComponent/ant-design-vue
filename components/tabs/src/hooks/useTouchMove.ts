import type { Ref } from 'vue';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import useState from '../../../_util/hooks/useState';

type TouchEventHandler = (e: TouchEvent) => void;
type WheelEventHandler = (e: WheelEvent) => void;

const MIN_SWIPE_DISTANCE = 0.1;
const STOP_SWIPE_DISTANCE = 0.01;
const REFRESH_INTERVAL = 20;
const SPEED_OFF_MULTIPLE = 0.995 ** REFRESH_INTERVAL;
// ================================= Hook =================================
export default function useTouchMove(
  domRef: Ref<HTMLDivElement>,
  onOffset: (offsetX: number, offsetY: number) => boolean,
) {
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number }>();
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [lastTimeDiff, setLastTimeDiff] = useState<number>(0);
  const [lastOffset, setLastOffset] = useState<{ x: number; y: number }>();
  const motionRef = ref<number>();

  // ========================= Events =========================
  // >>> Touch events
  function onTouchStart(e: TouchEvent) {
    const { screenX, screenY } = e.touches[0];
    setTouchPosition({ x: screenX, y: screenY });
    window.clearInterval(motionRef.value);
  }

  function onTouchMove(e: TouchEvent) {
    if (!touchPosition.value) return;

    e.preventDefault();
    const { screenX, screenY } = e.touches[0];
    setTouchPosition({ x: screenX, y: screenY });
    const offsetX = screenX - touchPosition.value.x;
    const offsetY = screenY - touchPosition.value.y;
    onOffset(offsetX, offsetY);
    const now = Date.now();
    setLastTimestamp(now);
    setLastTimeDiff(now - lastTimestamp.value);
    setLastOffset({ x: offsetX, y: offsetY });
  }

  function onTouchEnd() {
    if (!touchPosition.value) return;

    setTouchPosition(null);
    setLastOffset(null);

    // Swipe if needed
    if (lastOffset.value) {
      const distanceX = lastOffset.value.x / lastTimeDiff.value;
      const distanceY = lastOffset.value.y / lastTimeDiff.value;
      const absX = Math.abs(distanceX);
      const absY = Math.abs(distanceY);

      // Skip swipe if low distance
      if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) return;

      let currentX = distanceX;
      let currentY = distanceY;

      motionRef.value = window.setInterval(() => {
        if (Math.abs(currentX) < STOP_SWIPE_DISTANCE && Math.abs(currentY) < STOP_SWIPE_DISTANCE) {
          window.clearInterval(motionRef.value);
          return;
        }

        currentX *= SPEED_OFF_MULTIPLE;
        currentY *= SPEED_OFF_MULTIPLE;
        onOffset(currentX * REFRESH_INTERVAL, currentY * REFRESH_INTERVAL);
      }, REFRESH_INTERVAL);
    }
  }

  // >>> Wheel event
  const lastWheelDirectionRef = ref<'x' | 'y'>();

  function onWheel(e: WheelEvent) {
    const { deltaX, deltaY } = e;

    // Convert both to x & y since wheel only happened on PC
    let mixed = 0;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX === absY) {
      mixed = lastWheelDirectionRef.value === 'x' ? deltaX : deltaY;
    } else if (absX > absY) {
      mixed = deltaX;
      lastWheelDirectionRef.value = 'x';
    } else {
      mixed = deltaY;
      lastWheelDirectionRef.value = 'y';
    }

    if (onOffset(-mixed, -mixed)) {
      e.preventDefault();
    }
  }

  // ========================= Effect =========================
  const touchEventsRef = ref<{
    onTouchStart: TouchEventHandler;
    onTouchMove: TouchEventHandler;
    onTouchEnd: TouchEventHandler;
    onWheel: WheelEventHandler;
  }>({
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onWheel,
  });
  function onProxyTouchStart(e: TouchEvent) {
    touchEventsRef.value.onTouchStart(e);
  }
  function onProxyTouchMove(e: TouchEvent) {
    touchEventsRef.value.onTouchMove(e);
  }
  function onProxyTouchEnd(e: TouchEvent) {
    touchEventsRef.value.onTouchEnd(e);
  }
  function onProxyWheel(e: WheelEvent) {
    touchEventsRef.value.onWheel(e);
  }
  onMounted(() => {
    document.addEventListener('touchmove', onProxyTouchMove, { passive: false });
    document.addEventListener('touchend', onProxyTouchEnd, { passive: false });

    // No need to clean up since element removed
    domRef.value?.addEventListener('touchstart', onProxyTouchStart, { passive: false });
    domRef.value?.addEventListener('wheel', onProxyWheel, { passive: false });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('touchmove', onProxyTouchMove);
    document.removeEventListener('touchend', onProxyTouchEnd);
  });
}
