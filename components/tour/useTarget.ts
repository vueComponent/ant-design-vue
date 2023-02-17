import type { ComputedRef, Ref } from 'vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

export interface Gap {
  offset?: number;
  radius?: number;
}

export interface PosInfo {
  left: number;
  top: number;
  height: number;
  width: number;
  radius: number;
}

const isInViewPort = (element: HTMLElement) => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
};

export default function useTarget(
  target: Ref<any>,
  gap?: Gap,
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions,
): [ComputedRef<PosInfo>] {
  const posInfo = ref<PosInfo | null>(null);

  const updatePos = () => {
    if (target.value) {
      if (!isInViewPort(target.value.$el.nextElementSibling)) {
        target.value.$el.nextElementSibling.scrollIntoView(scrollIntoViewOptions);
      }
      const { left, top, width, height } =
        target.value.$el.nextElementSibling.getBoundingClientRect();
      posInfo.value = { left, top, width, height, radius: 0 };
    } else {
      posInfo.value = null;
    }
  };

  onMounted(() => {
    updatePos();
    window.addEventListener('resize', updatePos);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePos);
  });

  const mergedPosInfo = computed(() => {
    if (!posInfo.value) {
      return posInfo.value;
    }

    const gapOffset = gap?.offset || 6;
    const gapRadius = gap?.radius || 6;

    return {
      left: posInfo.value.left - gapOffset,
      top: posInfo.value.top - gapOffset,
      width: posInfo.value.width + gapOffset * 2,
      height: posInfo.value.height + gapOffset * 2,
      radius: gapRadius,
    };
  });

  return [mergedPosInfo];
}
