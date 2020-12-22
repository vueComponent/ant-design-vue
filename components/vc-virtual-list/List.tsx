import {
  ref,
  defineComponent,
  PropType,
  watchEffect,
  Component,
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  CSSProperties,
} from 'vue';
import { Key } from '../_util/type';
import Filler from './Filler';
import Item from './Item';
import ScrollBar from './ScrollBar';
import useHeights from './hooks/useHeights';
import useScrollTo from './hooks/useScrollTo';
import useFrameWheel from './hooks/useFrameWheel';
import useMobileTouchMove from './hooks/useMobileTouchMove';
import useOriginScroll from './hooks/useOriginScroll';
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { RenderFunc, SharedConfig } from './interface';
import supportsPassive from '../_util/supportsPassive';

const EMPTY_DATA = [];

const ScrollStyle: CSSProperties = {
  overflowY: 'auto',
  overflowAnchor: 'none',
};

function renderChildren<T>(
  list: T[],
  startIndex: number,
  endIndex: number,
  setNodeRef: (item: T, element: HTMLElement) => void,
  renderFunc: RenderFunc<T>,
  { getKey }: SharedConfig<T>,
) {
  return list.slice(startIndex, endIndex + 1).map((item, index) => {
    const eleIndex = startIndex + index;
    const node = renderFunc(item, eleIndex, {
      // style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    });
    const key = getKey(item);
    return (
      <Item key={key} setRef={ele => setNodeRef(item, ele as HTMLElement)}>
        {node}
      </Item>
    );
  });
}

export interface ListState<T = object> {
  scrollTop: number;
  scrollMoving: boolean;
  mergedData: T[];
}

const List = defineComponent({
  name: 'List',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    data: PropTypes.array,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: PropTypes.looseBool,
    itemKey: {
      type: [String, Number, Function] as PropType<Key | ((item: object) => Key)>,
      required: true,
    },
    component: {
      type: [String, Object] as PropType<string | Component>,
    },
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: PropTypes.looseBool,
    children: PropTypes.func,
    onScroll: PropTypes.func,
    onMousedown: PropTypes.func,
    onMouseenter: PropTypes.func,
  },
  setup(props) {
    // ================================= MISC =================================
    const useVirtual = computed(() => {
      const { height, itemHeight, virtual } = props;
      return !!(virtual !== false && height && itemHeight);
    });
    const inVirtual = computed(() => {
      const { height, itemHeight, data } = props;
      return useVirtual.value && data && itemHeight * data.length > height;
    });

    const state = reactive<ListState>({
      scrollTop: 0,
      scrollMoving: false,
      mergedData: computed(() => props.data || EMPTY_DATA) as any,
    });

    const componentRef = ref<HTMLDivElement>();
    const fillerInnerRef = ref<HTMLDivElement>();
    const scrollBarRef = ref<any>(); // Hack on scrollbar to enable flash call
    // =============================== Item Key ===============================
    const getKey = (item: Record<string, any>) => {
      if (typeof props.itemKey === 'function') {
        return props.itemKey(item);
      }
      return item[props.itemKey];
    };

    const sharedConfig = {
      getKey,
    };

    // ================================ Scroll ================================
    function syncScrollTop(newTop: number | ((prev: number) => number)) {
      let value: number;
      if (typeof newTop === 'function') {
        value = newTop(state.scrollTop);
      } else {
        value = newTop;
      }

      const alignedTop = keepInRange(value);

      if (componentRef.value) {
        componentRef.value.scrollTop = alignedTop;
      }
      state.scrollTop = alignedTop;
    }

    // ================================ Height ================================
    const [setInstance, collectHeight, heights] = useHeights(getKey, null, null);
    // ========================== Visible Calculation =========================
    const calRes = computed(() => {
      if (!useVirtual.value) {
        return {
          scrollHeight: undefined,
          start: 0,
          end: state.mergedData.length - 1,
          offset: undefined,
        };
      }

      // Always use virtual scroll bar in avoid shaking
      if (!inVirtual.value) {
        return {
          scrollHeight: fillerInnerRef.value?.offsetHeight || 0,
          start: 0,
          end: state.mergedData.length - 1,
          offset: undefined,
        };
      }

      let itemTop = 0;
      let startIndex: number | undefined;
      let startOffset: number | undefined;
      let endIndex: number | undefined;
      const dataLen = state.mergedData.length;
      for (let i = 0; i < dataLen; i += 1) {
        const item = state.mergedData[i];
        const key = getKey(item);

        const cacheHeight = heights[key];
        const currentItemBottom =
          itemTop + (cacheHeight === undefined ? props.itemHeight! : cacheHeight);

        if (currentItemBottom >= state.scrollTop && startIndex === undefined) {
          startIndex = i;
          startOffset = itemTop;
        }

        // Check item bottom in the range. We will render additional one item for motion usage
        if (currentItemBottom > state.scrollTop + props.height! && endIndex === undefined) {
          endIndex = i;
        }

        itemTop = currentItemBottom;
      }

      // Fallback to normal if not match. This code should never reach
      /* istanbul ignore next */
      if (startIndex === undefined) {
        startIndex = 0;
        startOffset = 0;
      }
      if (endIndex === undefined) {
        endIndex = state.mergedData.length - 1;
      }

      // Give cache to improve scroll experience
      endIndex = Math.min(endIndex + 1, state.mergedData.length);
      return {
        scrollHeight: itemTop,
        start: startIndex,
        end: endIndex,
        offset: startOffset,
      };
    });
    // =============================== In Range ===============================
    const maxScrollHeight = computed(() => calRes.value.scrollHeight! - props.height!);

    function keepInRange(newScrollTop: number) {
      let newTop = Math.max(newScrollTop, 0);
      if (!Number.isNaN(maxScrollHeight.value)) {
        newTop = Math.min(newTop, maxScrollHeight.value);
      }
      return newTop;
    }

    const isScrollAtTop = computed(() => state.scrollTop <= 0);
    const isScrollAtBottom = computed(() => state.scrollTop >= maxScrollHeight.value);

    const originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom);

    // ================================ Scroll ================================
    function onScrollBar(newScrollTop: number) {
      const newTop = newScrollTop;
      syncScrollTop(newTop);
    }

    // This code may only trigger in test case.
    // But we still need a sync if some special escape
    function onFallbackScroll(e: UIEvent) {
      const { scrollTop: newScrollTop } = e.currentTarget as Element;
      if (Math.abs(newScrollTop - state.scrollTop) >= 1) {
        syncScrollTop(newScrollTop);
      }

      // Trigger origin onScroll
      props.onScroll?.(e);
    }

    // Since this added in global,should use ref to keep update
    const [onRawWheel, onFireFoxScroll] = useFrameWheel(
      useVirtual,
      isScrollAtTop,
      isScrollAtBottom,
      offsetY => {
        syncScrollTop(top => {
          const newTop = top + offsetY;
          return newTop;
        });
      },
    );

    // Mobile touch move
    useMobileTouchMove(useVirtual, componentRef, (deltaY, smoothOffset) => {
      if (originScroll(deltaY, smoothOffset)) {
        return false;
      }

      onRawWheel({ preventDefault() {}, deltaY } as WheelEvent);
      return true;
    });
    // Firefox only
    function onMozMousePixelScroll(e: MouseEvent) {
      if (useVirtual.value) {
        e.preventDefault();
      }
    }
    const removeEventListener = () => {
      if (componentRef.value) {
        componentRef.value.removeEventListener(
          'wheel',
          onRawWheel,
          supportsPassive ? ({ passive: false } as EventListenerOptions) : false,
        );
        componentRef.value.removeEventListener('DOMMouseScroll', onFireFoxScroll as any);
        componentRef.value.removeEventListener('MozMousePixelScroll', onMozMousePixelScroll as any);
      }
    };
    watchEffect(() => {
      nextTick(() => {
        if (componentRef.value) {
          removeEventListener();
          componentRef.value.addEventListener(
            'wheel',
            onRawWheel,
            supportsPassive ? ({ passive: false } as EventListenerOptions) : false,
          );
          componentRef.value.addEventListener('DOMMouseScroll', onFireFoxScroll as any);
          componentRef.value.addEventListener('MozMousePixelScroll', onMozMousePixelScroll as any);
        }
      });
    });

    onBeforeUnmount(() => {
      removeEventListener();
    });

    // ================================= Ref ==================================
    const scrollTo = useScrollTo(
      componentRef,
      state,
      heights,
      props,
      getKey,
      collectHeight,
      syncScrollTop,
      () => {
        scrollBarRef.value?.delayHidden();
      },
    );

    const componentStyle = computed(() => {
      let cs: CSSProperties | null = null;
      if (props.height) {
        cs = { [props.fullHeight ? 'height' : 'maxHeight']: props.height + 'px', ...ScrollStyle };

        if (useVirtual.value) {
          cs!.overflowY = 'hidden';

          if (state.scrollMoving) {
            cs!.pointerEvents = 'none';
          }
        }
      }
      return cs;
    });

    return {
      state,
      componentStyle,
      scrollTo,
      onFallbackScroll,
      onScrollBar,
      componentRef,
      useVirtual,
      calRes,
      collectHeight,
      setInstance,
      sharedConfig,
      scrollBarRef,
      fillerInnerRef,
    };
  },
  render() {
    const {
      prefixCls = 'rc-virtual-list',
      height,
      itemHeight,
      // eslint-disable-next-line no-unused-vars
      fullHeight,
      data,
      itemKey,
      virtual,
      component: Component = 'div',
      onScroll,
      children,
      style,
      class: className,
      ...restProps
    } = { ...this.$props, ...this.$attrs } as any;
    const mergedClassName = classNames(prefixCls, className);
    const { scrollTop, mergedData } = this.state;
    const { scrollHeight, offset, start, end } = this.calRes;
    const {
      componentStyle,
      onFallbackScroll,
      onScrollBar,
      useVirtual,
      collectHeight,
      sharedConfig,
      setInstance,
    } = this;
    const listChildren = renderChildren(
      mergedData,
      start,
      end,
      setInstance,
      children,
      sharedConfig,
    );

    return (
      <div
        style={{
          ...style,
          position: 'relative',
        }}
        class={mergedClassName}
        {...restProps}
      >
        <Component
          class={`${prefixCls}-holder`}
          style={componentStyle}
          ref="componentRef"
          onScroll={onFallbackScroll}
        >
          <Filler
            prefixCls={prefixCls}
            height={scrollHeight}
            offset={offset}
            onInnerResize={collectHeight}
            ref="fillerInnerRef"
          >
            {listChildren}
          </Filler>
        </Component>

        {useVirtual && (
          <ScrollBar
            ref="scrollBarRef"
            prefixCls={prefixCls}
            scrollTop={scrollTop}
            height={height}
            scrollHeight={scrollHeight}
            count={mergedData.length}
            onScroll={onScrollBar}
            onStartMove={() => {
              this.state.scrollMoving = true;
            }}
            onStopMove={() => {
              this.state.scrollMoving = false;
            }}
          />
        )}
      </div>
    );
  },
});

export default List;
