import type { PropType } from 'vue';
import {
  nextTick,
  defineComponent,
  ref,
  computed,
  onMounted,
  onUpdated,
  watch,
  onUnmounted,
} from 'vue';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from '../vc-util/Dom/addEventListener';
import { cloneElement } from '../_util/vnode';
import isVisible from '../vc-util/Dom/isVisible';

import { isSamePoint, restoreFocus, monitorResize } from './util';
import type { AlignType, AlignResult, TargetType, TargetPoint } from './interface';
import useBuffer from './hooks/useBuffer';
import isEqual from 'lodash-es/isEqual';

type OnAlign = (source: HTMLElement, result: AlignResult) => void;

export interface AlignProps {
  align: AlignType;
  target: TargetType;
  onAlign?: OnAlign;
  monitorBufferTime?: number;
  monitorWindowResize?: boolean;
  disabled?: boolean;
}

export const alignProps = {
  align: Object as PropType<AlignType>,
  target: [Object, Function] as PropType<TargetType>,
  onAlign: Function as PropType<OnAlign>,
  monitorBufferTime: Number,
  monitorWindowResize: Boolean,
  disabled: Boolean,
};

interface MonitorRef {
  element?: HTMLElement;
  cancel: () => void;
}

export interface RefAlign {
  forceAlign: () => void;
}

function getElement(func: TargetType) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point: TargetType) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

export default defineComponent({
  name: 'Align',
  props: alignProps,
  emits: ['align'],
  setup(props, { expose, slots }) {
    const cacheRef = ref<{ element?: HTMLElement; point?: TargetPoint; align?: AlignType }>({});
    const nodeRef = ref();
    const [forceAlign, cancelForceAlign] = useBuffer(
      () => {
        const {
          disabled: latestDisabled,
          target: latestTarget,
          align: latestAlign,
          onAlign: latestOnAlign,
        } = props;
        if (!latestDisabled && latestTarget && nodeRef.value) {
          const source = nodeRef.value;

          let result: AlignResult;
          const element = getElement(latestTarget);
          const point = getPoint(latestTarget);

          cacheRef.value.element = element;
          cacheRef.value.point = point;
          cacheRef.value.align = latestAlign;
          // IE lose focus after element realign
          // We should record activeElement and restore later
          const { activeElement } = document;
          // We only align when element is visible
          if (element && isVisible(element)) {
            result = alignElement(source, element, latestAlign);
          } else if (point) {
            result = alignPoint(source, point, latestAlign);
          }
          restoreFocus(activeElement, source);

          if (latestOnAlign && result) {
            latestOnAlign(source, result);
          }

          return true;
        }

        return false;
      },
      computed(() => props.monitorBufferTime),
    );

    // ===================== Effect =====================
    // Listen for target updated
    const resizeMonitor = ref<MonitorRef>({
      cancel: () => {},
    });
    // Listen for source updated
    const sourceResizeMonitor = ref<MonitorRef>({
      cancel: () => {},
    });

    const goAlign = () => {
      const target = props.target;
      const element = getElement(target);
      const point = getPoint(target);

      if (nodeRef.value !== sourceResizeMonitor.value.element) {
        sourceResizeMonitor.value.cancel();
        sourceResizeMonitor.value.element = nodeRef.value;
        sourceResizeMonitor.value.cancel = monitorResize(nodeRef.value, forceAlign);
      }

      if (
        cacheRef.value.element !== element ||
        !isSamePoint(cacheRef.value.point, point) ||
        !isEqual(cacheRef.value.align, props.align)
      ) {
        forceAlign();

        // Add resize observer
        if (resizeMonitor.value.element !== element) {
          resizeMonitor.value.cancel();
          resizeMonitor.value.element = element;
          resizeMonitor.value.cancel = monitorResize(element, forceAlign);
        }
      }
    };

    onMounted(() => {
      nextTick(() => {
        goAlign();
      });
    });

    onUpdated(() => {
      nextTick(() => {
        goAlign();
      });
    });

    // Listen for disabled change
    watch(
      () => props.disabled,
      disabled => {
        if (!disabled) {
          forceAlign();
        } else {
          cancelForceAlign();
        }
      },
      { immediate: true, flush: 'post' },
    );

    // Listen for window resize
    const winResizeRef = ref<{ remove: Function }>(null);

    watch(
      () => props.monitorWindowResize,
      monitorWindowResize => {
        if (monitorWindowResize) {
          if (!winResizeRef.value) {
            winResizeRef.value = addEventListener(window, 'resize', forceAlign);
          }
        } else if (winResizeRef.value) {
          winResizeRef.value.remove();
          winResizeRef.value = null;
        }
      },
      { flush: 'post' },
    );
    onUnmounted(() => {
      resizeMonitor.value.cancel();
      sourceResizeMonitor.value.cancel();
      if (winResizeRef.value) winResizeRef.value.remove();
      cancelForceAlign();
    });

    expose({
      forceAlign: () => forceAlign(true),
    });

    return () => {
      const child = slots?.default();
      if (child) {
        return cloneElement(child[0], { ref: nodeRef }, true, true);
      }
      return null;
    };
  },
});
