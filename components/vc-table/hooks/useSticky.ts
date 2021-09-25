import canUseDom from '../../_util/canUseDom';
import type { ComputedRef, Ref } from 'vue';
import { computed } from 'vue';
import type { TableSticky } from '../interface';

// fix ssr render
const defaultContainer = canUseDom() ? window : null;

/** Sticky header hooks */
export default function useSticky(
  stickyRef: Ref<boolean | TableSticky>,
  prefixClsRef: Ref<string>,
): ComputedRef<{
  isSticky: boolean;
  offsetHeader: number;
  offsetSummary: number;
  offsetScroll: number;
  stickyClassName: string;
  container: Window | HTMLElement;
}> {
  return computed(() => {
    const {
      offsetHeader = 0,
      offsetSummary = 0,
      offsetScroll = 0,
      getContainer = () => defaultContainer,
    } = typeof stickyRef.value === 'object' ? stickyRef.value : {};

    const container = getContainer() || defaultContainer;
    const isSticky = !!stickyRef.value;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixClsRef.value}-sticky-holder` : '',
      offsetHeader,
      offsetSummary,
      offsetScroll,
      container,
    };
  });
}
