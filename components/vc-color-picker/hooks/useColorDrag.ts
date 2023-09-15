import type { Color } from '../color';
import type { TransformOffset } from '../interface';

import { ref, shallowRef, watch, onUnmounted, computed } from 'vue';
import type { ComputedRef, Ref } from 'vue';

type EventType = MouseEvent | TouchEvent;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  colorRef: Ref<Color>;
  offset?: TransformOffset;
  containerRef: Ref<HTMLDivElement>;
  targetRef: Ref<{ transformDomRef: HTMLDivElement }>;
  direction?: ComputedRef<'x' | 'y'>;
  onDragChange?: (offset: TransformOffset) => void;
  onDragChangeComplete?: () => void;
  calculate?: (containerRef: Ref<HTMLDivElement>) => TransformOffset;
  /** Disabled drag */
  disabledDrag?: ComputedRef<boolean>;
}

function getPosition(e: EventType) {
  const obj = 'touches' in e ? e.touches[0] : e;
  const scrollXOffset =
    document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
  const scrollYOffset =
    document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
  return { pageX: obj.pageX - scrollXOffset, pageY: obj.pageY - scrollYOffset };
}

function useColorDrag(props: useColorDragProps): [Ref<TransformOffset>, EventHandle] {
  const {
    offset,
    targetRef,
    containerRef,
    direction,
    onDragChange,
    onDragChangeComplete,
    calculate,
    disabledDrag,
    colorRef,
  } = props;
  const offsetValue = ref(offset || { x: 0, y: 0 });
  const mouseMoveRef = shallowRef<(event: MouseEvent) => void>(null);
  const mouseUpRef = shallowRef<(event: MouseEvent) => void>(null);
  const dragRef = shallowRef({ flag: false });

  setTimeout(() => {
    const calcOffset = calculate?.(containerRef);
    if (calcOffset) {
      offsetValue.value = calcOffset;
    }
  });

  watch(
    () => [colorRef, containerRef],
    () => {
      if (dragRef.value.flag === false) {
        const calcOffset = calculate?.(containerRef);
        if (calcOffset) {
          offsetValue.value = calcOffset;
        }
      }
    },
    {
      deep: true,
      flush: 'post',
    },
  );

  onUnmounted(() => {
    document.removeEventListener('mousemove', mouseMoveRef.value);
    document.removeEventListener('mouseup', mouseUpRef.value);
    document.removeEventListener('touchmove', mouseMoveRef.value);
    document.removeEventListener('touchend', mouseUpRef.value);
    mouseMoveRef.value = null;
    mouseUpRef.value = null;
  });

  const updateOffset: EventHandle = e => {
    const { pageX, pageY } = getPosition(e);
    const { x: rectX, y: rectY, width, height } = containerRef.value.getBoundingClientRect();
    const { width: targetWidth, height: targetHeight } =
      targetRef.value?.transformDomRef.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

    const calcOffset = computed(() => ({
      x: offsetX,
      y: direction?.value === 'x' ? offsetValue.value.y : offsetY,
    }));

    // Exclusion of boundary cases
    if ((targetWidth === 0 && targetHeight === 0) || targetWidth !== targetHeight) {
      return false;
    }
    offsetValue.value = calcOffset.value;
    onDragChange?.(calcOffset.value);
  };

  const onDragMove: EventHandle = e => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStop: EventHandle = e => {
    e.preventDefault();
    dragRef.value.flag = false;
    document.removeEventListener('mousemove', mouseMoveRef.value);
    document.removeEventListener('mouseup', mouseUpRef.value);
    document.removeEventListener('touchmove', mouseMoveRef.value);
    document.removeEventListener('touchend', mouseUpRef.value);
    mouseMoveRef.value = null;
    mouseUpRef.value = null;
    onDragChangeComplete?.();
  };

  const onDragStart: EventHandle = e => {
    document.removeEventListener('mousemove', mouseMoveRef.value);
    document.removeEventListener('mouseup', mouseUpRef.value);
    if (disabledDrag.value) {
      return;
    }
    updateOffset(e);
    dragRef.value.flag = true;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragStop);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragStop);
    mouseMoveRef.value = onDragMove;
    mouseUpRef.value = onDragStop;
  };
  return [offsetValue, onDragStart];
}

export default useColorDrag;
