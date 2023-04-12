import addEventListenerWrap from '../../vc-util/Dom/addEventListener';
import type { EventHandler } from '../../_util/EventInterface';
import raf from '../../_util/raf';
import {
  defineComponent,
  onUnmounted,
  computed,
  shallowRef,
  watchEffect,
  getCurrentInstance,
} from 'vue';
import type { PropType } from 'vue';
import devWarning from '../../vc-util/devWarning';
import type { ColumnType } from '../interface';
import { useInjectTableContext } from '../../table/context';
import supportsPassive from '../../_util/supportsPassive';

const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
};
type HandleEvent = MouseEvent & TouchEvent;

const defaultMinWidth = 50;
export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'DragHandle',
  props: {
    prefixCls: String,
    width: {
      type: Number,
      required: true,
    },
    minWidth: {
      type: Number,
      default: defaultMinWidth,
    },
    maxWidth: {
      type: Number,
      default: Infinity,
    },
    column: {
      type: Object as PropType<ColumnType<any>>,
      default: undefined as ColumnType<any>,
    },
  },
  setup(props) {
    let startX = 0;
    let moveEvent = { remove: () => {} };
    let stopEvent = { remove: () => {} };
    const removeEvents = () => {
      moveEvent.remove();
      stopEvent.remove();
    };
    onUnmounted(() => {
      removeEvents();
    });
    watchEffect(() => {
      devWarning(!isNaN(props.width), 'Table', 'width must be a number when use resizable');
    });

    const { onResizeColumn } = useInjectTableContext();
    const minWidth = computed(() => {
      return typeof props.minWidth === 'number' && !isNaN(props.minWidth)
        ? props.minWidth
        : defaultMinWidth;
    });
    const maxWidth = computed(() => {
      return typeof props.maxWidth === 'number' && !isNaN(props.maxWidth)
        ? props.maxWidth
        : Infinity;
    });
    const instance = getCurrentInstance();
    let baseWidth = 0;
    const dragging = shallowRef(false);
    let rafId: number;
    const updateWidth = (e: HandleEvent) => {
      let pageX = 0;
      if (e.touches) {
        if (e.touches.length) {
          // touchmove
          pageX = e.touches[0].pageX;
        } else {
          // touchend
          pageX = e.changedTouches[0].pageX;
        }
      } else {
        pageX = e.pageX;
      }
      const tmpDeltaX = startX - pageX;
      let w = Math.max(baseWidth - tmpDeltaX, minWidth.value);
      w = Math.min(w, maxWidth.value);
      raf.cancel(rafId);
      rafId = raf(() => {
        onResizeColumn(w, props.column.__originColumn__);
      });
    };
    const handleMove = (e: HandleEvent) => {
      updateWidth(e);
    };
    const handleStop = (e: HandleEvent) => {
      dragging.value = false;
      updateWidth(e);
      removeEvents();
    };
    const handleStart = (e: HandleEvent, eventsFor: any) => {
      dragging.value = true;
      removeEvents();
      baseWidth = instance.vnode.el.parentNode.getBoundingClientRect().width;
      if (e instanceof MouseEvent && e.which !== 1) {
        return;
      }
      if (e.stopPropagation) e.stopPropagation();
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      moveEvent = addEventListenerWrap(document.documentElement, eventsFor.move, handleMove);
      stopEvent = addEventListenerWrap(document.documentElement, eventsFor.stop, handleStop);
    };
    const handleDown: EventHandler = (e: HandleEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleStart(e, events.mouse);
    };
    const handleTouchDown: EventHandler = (e: HandleEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleStart(e, events.touch);
    };

    const handleClick: EventHandler = (e: HandleEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return () => {
      const { prefixCls } = props;
      const touchEvents = {
        [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: e => handleTouchDown(e),
      };
      return (
        <div
          class={`${prefixCls}-resize-handle ${dragging.value ? 'dragging' : ''}`}
          onMousedown={handleDown}
          {...touchEvents}
          onClick={handleClick}
        >
          <div class={`${prefixCls}-resize-handle-line`}></div>
        </div>
      );
    };
  },
});
