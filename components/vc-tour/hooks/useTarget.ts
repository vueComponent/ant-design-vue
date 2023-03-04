import { computed, watchEffect, watch } from 'vue';
import type { Ref } from 'vue';
import { isInViewPort } from '../util';
import type { TourStepInfo } from '..';

import useState from '../../_util/hooks/useState';

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

export default function useTarget(
  target: Ref<TourStepInfo['target']>,
  open: Ref<boolean>,
  gap?: Ref<Gap>,
  scrollIntoViewOptions?: Ref<boolean | ScrollIntoViewOptions>,
): [Ref<PosInfo>, Ref<HTMLElement>] {
  // ========================= Target =========================
  // We trade `undefined` as not get target by function yet.
  // `null` as empty target.
  const [targetElement, setTargetElement] = useState<null | HTMLElement | undefined>(undefined);

  watchEffect(() => {
    const nextElement = typeof target.value === 'function' ? (target.value as any)() : target.value;

    setTargetElement(nextElement || null);
  });

  // ========================= Align ==========================
  const [posInfo, setPosInfo] = useState<PosInfo>(null);

  const updatePos = () => {
    if (targetElement.value) {
      // Exist target element. We should scroll and get target position
      if (!isInViewPort(targetElement.value) && open.value) {
        targetElement.value.scrollIntoView(scrollIntoViewOptions.value);
      }

      const { left, top, width, height } = targetElement.value.getBoundingClientRect();
      const nextPosInfo: PosInfo = { left, top, width, height, radius: 0 };

      setPosInfo(nextPosInfo);
    } else {
      // Not exist target which means we just show in center
      setPosInfo(null);
    }
  };

  watchEffect(() => {
    updatePos();
    // update when window resize
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('resize', updatePos);
    };
  });

  watch(
    open,
    val => {
      updatePos();
      // update when window resize
      if (val) {
        window.addEventListener('resize', updatePos);
      } else {
        window.removeEventListener('resize', updatePos);
      }
    },
    { immediate: true },
  );

  // ======================== PosInfo =========================
  const mergedPosInfo = computed(() => {
    if (!posInfo.value) {
      return posInfo.value;
    }

    const gapOffset = gap.value?.offset || 6;
    const gapRadius = gap.value?.radius || 2;

    return {
      left: posInfo.value.left - gapOffset,
      top: posInfo.value.top - gapOffset,
      width: posInfo.value.width + gapOffset * 2,
      height: posInfo.value.height + gapOffset * 2,
      radius: gapRadius,
    };
  });

  return [mergedPosInfo, targetElement];
}
