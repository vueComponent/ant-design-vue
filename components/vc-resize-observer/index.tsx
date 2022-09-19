// based on rc-resize-observer 1.0.0
import type { PropType } from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  watch,
} from 'vue';
import { findDOMNode } from '../_util/props-util';

interface ResizeObserverState {
  height: number;
  width: number;
  offsetHeight: number;
  offsetWidth: number;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ResizeObserver',
  props: {
    disabled: Boolean,
    onResize: Function as PropType<
      (
        size: {
          width: number;
          height: number;
          offsetWidth: number;
          offsetHeight: number;
        },
        element: HTMLElement,
      ) => void
    >,
  },
  emits: ['resize'],
  setup(props, { slots }) {
    const state = reactive<ResizeObserverState>({
      width: 0,
      height: 0,
      offsetHeight: 0,
      offsetWidth: 0,
    });
    let currentElement: Element | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const destroyObserver = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };

    const onResize: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
      const { onResize } = props;

      const target = entries[0].target as HTMLElement;

      const { width, height } = target.getBoundingClientRect();
      const { offsetWidth, offsetHeight } = target;

      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about element size,
       * let's use `boundary` instead of `contentRect` here to avoid shaking.
       */
      const fixedWidth = Math.floor(width);
      const fixedHeight = Math.floor(height);

      if (
        state.width !== fixedWidth ||
        state.height !== fixedHeight ||
        state.offsetWidth !== offsetWidth ||
        state.offsetHeight !== offsetHeight
      ) {
        const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };

        Object.assign(state, size);
        if (onResize) {
          // defer the callback but not defer to next frame
          Promise.resolve().then(() => {
            onResize(
              {
                ...size,
                offsetWidth,
                offsetHeight,
              },
              target,
            );
          });
        }
      }
    };
    const instance = getCurrentInstance();
    const registerObserver = () => {
      const { disabled } = props;

      // Unregister if disabled
      if (disabled) {
        destroyObserver();
        return;
      }
      // Unregister if element changed
      const element = findDOMNode(instance) as Element;
      const elementChanged = element !== currentElement;
      if (elementChanged) {
        destroyObserver();
        currentElement = element;
      }

      if (!resizeObserver && element) {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(element);
      }
    };
    onMounted(() => {
      registerObserver();
    });
    onUpdated(() => {
      registerObserver();
    });
    onUnmounted(() => {
      destroyObserver();
    });
    watch(
      () => props.disabled,
      () => {
        registerObserver();
      },
      { flush: 'post' },
    );
    return () => {
      return slots.default?.()[0];
    };
  },
});
