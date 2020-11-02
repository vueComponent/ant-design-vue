import { nextTick, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from '../vc-util/Dom/addEventListener';
import { isWindow, buffer, isSamePoint, restoreFocus, monitorResize } from './util';
import { cloneElement } from '../_util/vnode';
import { getSlot, findDOMNode } from '../_util/props-util';
import useBuffer from './hooks/useBuffer';
import isVisible from '../vc-util/Dom/isVisible';

function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

export default defineComponent({
  props: {
    childrenProps: PropTypes.object,
    align: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).def(() => window),
    monitorBufferTime: PropTypes.number.def(50),
    monitorWindowResize: PropTypes.looseBool.def(false),
    disabled: PropTypes.looseBool.def(false),
  },
  setup() {
    return {
      aligned: false,
      sourceResizeMonitor: { cancel: () => {} },
      resizeMonitor: { cancel: () => {} },
      cacheInfo: {},
    };
  },
  data() {
    this.prevProps = { ...this.$props };
    const [forceAlign, cancelForceAlign] = useBuffer(this.goAlign, 0);
    return {
      forceAlign,
      cancelForceAlign,
    };
  },
  mounted() {
    nextTick(() => {
      const props = this.$props;
      // if parent ref not attached .... use document.getElementById
      !this.aligned && this.forceAlign();
      if (!props.disabled && props.monitorWindowResize) {
        this.startMonitorWindowResize();
      }
      this.startMonitorElementResize();
      this.updateCache();
    });
  },
  updated() {
    nextTick(() => {
      const prevProps = this.prevProps;
      const props = this.$props;
      let reAlign = false;
      if (!props.disabled) {
        if (prevProps.disabled) {
          reAlign = true;
        } else {
          const { element: lastElement, point: lastPoint } = this.cacheInfo;
          const currentElement = getElement(props.target);
          const currentPoint = getPoint(props.target);
          if (isWindow(lastElement) && isWindow(currentElement)) {
            // Skip if is window
            reAlign = false;
          } else if (
            (lastElement && !currentElement && currentPoint) || // Change from element to point
            (lastPoint && currentPoint && currentElement) // Change from point to element
          ) {
            reAlign = true;
          }
        }
      }

      if (reAlign) {
        this.forceAlign();
      } else {
        this.startMonitorElementResize();
      }

      if (props.monitorWindowResize && !props.disabled) {
        this.startMonitorWindowResize();
      } else {
        this.stopMonitorWindowResize();
      }
      this.prevProps = { ...this.$props };
      this.updateCache();
    });
  },
  beforeUnmount() {
    this.stopMonitorWindowResize();
    this.resizeMonitor?.cancel();
    this.sourceResizeMonitor?.cancel();
    this.cancelForceAlign();
  },
  methods: {
    updateCache() {
      const element = getElement(this.$props.target);
      const point = getPoint(this.$props.target);
      this.cacheInfo = {
        element,
        point,
      };
    },
    startMonitorElementResize() {
      const props = this.$props;
      const { element: lastElement, point: lastPoint } = this.cacheInfo;
      const currentElement = getElement(props.target);
      const currentPoint = getPoint(props.target);
      const source = findDOMNode(this);
      const { sourceResizeMonitor, resizeMonitor } = this;
      if (source !== sourceResizeMonitor.element) {
        sourceResizeMonitor?.cancel();
        sourceResizeMonitor.element = source;
        sourceResizeMonitor.cancel = monitorResize(source, this.forceAlign);
      }
      if (lastElement !== currentElement || !isSamePoint(lastPoint, currentPoint)) {
        this.forceAlign();
        // Add resize observer
        if (resizeMonitor.element !== currentElement) {
          resizeMonitor?.cancel();
          resizeMonitor.element = currentElement;
          resizeMonitor.cancel = monitorResize(currentElement, this.forceAlign);
        }
      }
    },
    startMonitorWindowResize() {
      if (!this.resizeHandler) {
        this.bufferMonitor = buffer(this.forceAlign, this.$props.monitorBufferTime);
        this.resizeHandler = addEventListener(window, 'resize', this.bufferMonitor);
      }
    },

    stopMonitorWindowResize() {
      if (this.resizeHandler) {
        this.bufferMonitor.clear();
        this.resizeHandler.remove();
        this.resizeHandler = null;
      }
    },
    goAlign() {
      const { disabled, target, align } = this.$props;
      if (!disabled && target) {
        const source = findDOMNode(this);
        let result;
        const element = getElement(target);
        const point = getPoint(target);

        // IE lose focus after element realign
        // We should record activeElement and restore later
        const activeElement = document.activeElement;
        if (element && isVisible(element)) {
          result = alignElement(source, element, align);
        } else if (point) {
          result = alignPoint(source, point, align);
        }
        restoreFocus(activeElement, source);
        this.aligned = true;
        this.$attrs.onAlign && result && this.$attrs.onAlign(source, result);
        return true;
      }
      return false;
    },
  },

  render() {
    const { childrenProps } = this.$props;
    const child = getSlot(this);
    if (child && childrenProps) {
      return cloneElement(child[0], childrenProps);
    }
    return child && child[0];
  },
});
