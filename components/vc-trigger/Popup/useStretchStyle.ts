import type { ComputedRef, CSSProperties, Ref } from 'vue';
import { computed, shallowRef } from 'vue';
import type { StretchType } from '../interface';

export default (
  stretch?: Ref<StretchType>,
): [ComputedRef<CSSProperties>, (element: HTMLElement) => void] => {
  const targetSize = shallowRef({ width: 0, height: 0 });

  function measureStretch(element: HTMLElement) {
    targetSize.value = {
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  }

  // Merge stretch style
  const style = computed(() => {
    const sizeStyle: CSSProperties = {};

    if (stretch.value) {
      const { width, height } = targetSize.value;

      // Stretch with target
      if (stretch.value.indexOf('height') !== -1 && height) {
        sizeStyle.height = `${height}px`;
      } else if (stretch.value.indexOf('minHeight') !== -1 && height) {
        sizeStyle.minHeight = `${height}px`;
      }
      if (stretch.value.indexOf('width') !== -1 && width) {
        sizeStyle.width = `${width}px`;
      } else if (stretch.value.indexOf('minWidth') !== -1 && width) {
        sizeStyle.minWidth = `${width}px`;
      }
    }

    return sizeStyle;
  });

  return [style, measureStretch];
};
