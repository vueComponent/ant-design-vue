import type { PropType, Component, CSSProperties } from 'vue';
import {
  shallowRef,
  toRaw,
  onMounted,
  onUpdated,
  defineComponent,
  watchEffect,
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  watch,
} from 'vue';
import type { Key } from '../_util/type';
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
import type { RenderFunc, SharedConfig } from './interface';
import supportsPassive from '../_util/supportsPassive';

const EMPTY_DATA = [];

const ScrollStyle: CSSProperties = {
  overflowY: 'auto',
  overflowAnchor: 'none',
};

export type ScrollAlign = 'top' | 'bottom' | 'auto';
export type ScrollConfig =
  | {
      index: number;
      align?: ScrollAlign;
      offset?: number;
    }
  | {
      key: Key;
      align?: ScrollAlign;
      offset?: number;
    };
export type ScrollTo = (arg: number | ScrollConfig) => void;

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

export interface ListState {
  scrollTop: number;
  scrollMoving: boolean;
}

const List = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'List',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    data: PropTypes.array,
    height: Number,
    itemHeight: Number,
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: { type: Boolean, default: undefined },
    itemKey: {
      type: [String, Number, Function] as PropType<Key | ((item: Record<string, any>) => Key)>,
      required: true,
    },
    component: {
      type: [String, Object] as PropType<string | Component>,
    },
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: { type: Boolean, default: undefined },
    children: Function,
    onScroll: Function,
    onMousedown: Function,
    onMouseenter: Function,
    onVisibleChange: Function as PropType<(visibleList: any[], fullList: any[]) => void>,
  },
  setup(props, { expose }) {
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
    });
    const data = computed(() => {
      return props.data || EMPTY_DATA;
    });
    const mergedData = shallowRef([]);
    watch(
      data,
      () => {
        mergedData.value = toRaw(data.value).slice();
      },
      { immediate: true },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemKey = shallowRef((_item: Record<string, any>) => undefined);
    watch(
      () => props.itemKey,
      val => {
        if (typeof val === 'function') {
          itemKey.value = val;
        } else {
          itemKey.value = item => item?.[val];
        }
      },
      { immediate: true },
    );
    const componentRef = shallowRef<HTMLDivElement>();
    const fillerInnerRef = shallowRef<HTMLDivElement>();
    const scrollBarRef = shallowRef<any>(); // Hack on scrollbar to enable flash call
    // =============================== Item Key ===============================
    const getKey = (item: Record<string, any>) => {
      return itemKey.value(item);
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
    const [setInstance, collectHeight, heights, updatedMark] = useHeights(
      mergedData,
      getKey,
      null,
      null,
    );

    const calRes = reactive<{
      scrollHeight?: number;
      start?: number;
      end?: number;
      offset?: number;
    }>({
      scrollHeight: undefined,
      start: 0,
      end: 0,
      offset: undefined,
    });

    const offsetHeight = shallowRef(0);
    onMounted(() => {
      nextTick(() => {
        offsetHeight.value = fillerInnerRef.value?.offsetHeight || 0;
      });
    });
    onUpdated(() => {
      nextTick(() => {
        offsetHeight.value = fillerInnerRef.value?.offsetHeight || 0;
      });
    });
    watch(
      [useVirtual, mergedData],
      () => {
        if (!useVirtual.value) {
          Object.assign(calRes, {
            scrollHeight: undefined,
            start: 0,
            end: mergedData.value.length - 1,
            offset: undefined,
          });
        }
      },
      { immediate: true },
    );
    watch(
      [useVirtual, mergedData, offsetHeight, inVirtual],
      () => {
        // Always use virtual scroll bar in avoid shaking
        if (useVirtual.value && !inVirtual.value) {
          Object.assign(calRes, {
            scrollHeight: offsetHeight.value,
            start: 0,
            end: mergedData.value.length - 1,
            offset: undefined,
          });
        }
        if (componentRef.value) {
          state.scrollTop = componentRef.value.scrollTop;
        }
      },
      {
        immediate: true,
      },
    );
    watch(
      [
        inVirtual,
        useVirtual,
        () => state.scrollTop,
        mergedData,
        updatedMark,
        () => props.height,
        offsetHeight,
      ],
      () => {
        if (!useVirtual.value || !inVirtual.value) {
          return;
        }

        let itemTop = 0;
        let startIndex: number | undefined;
        let startOffset: number | undefined;
        let endIndex: number | undefined;
        const dataLen = mergedData.value.length;
        const data = mergedData.value;
        const scrollTop = state.scrollTop;
        const { itemHeight, height } = props;
        const scrollTopHeight = scrollTop + height;

        for (let i = 0; i < dataLen; i += 1) {
          const item = data[i];
          const key = getKey(item);

          let cacheHeight = heights.get(key);
          if (cacheHeight === undefined) {
            cacheHeight = itemHeight;
          }
          const currentItemBottom = itemTop + cacheHeight;

          if (startIndex === undefined && currentItemBottom >= scrollTop) {
            startIndex = i;
            startOffset = itemTop;
          }

          // Check item bottom in the range. We will render additional one item for motion usage
          if (endIndex === undefined && currentItemBottom > scrollTopHeight) {
            endIndex = i;
          }

          itemTop = currentItemBottom;
        }

        // When scrollTop at the end but data cut to small count will reach this
        if (startIndex === undefined) {
          startIndex = 0;
          startOffset = 0;
          endIndex = Math.ceil(height / itemHeight);
        }
        if (endIndex === undefined) {
          endIndex = dataLen - 1;
        }

        // Give cache to improve scroll experience
        endIndex = Math.min(endIndex + 1, dataLen);
        Object.assign(calRes, {
          scrollHeight: itemTop,
          start: startIndex,
          end: endIndex,
          offset: startOffset,
        });
      },
      { immediate: true },
    );

    // =============================== In Range ===============================
    const maxScrollHeight = computed(() => calRes.scrollHeight! - props.height!);

    function keepInRange(newScrollTop: number) {
      let newTop = newScrollTop;
      if (!Number.isNaN(maxScrollHeight.value)) {
        newTop = Math.min(newTop, maxScrollHeight.value);
      }
      newTop = Math.max(newTop, 0);
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

    // When data size reduce. It may trigger native scroll event back to fit scroll position
    function onFallbackScroll(e: UIEvent) {
      const { scrollTop: newScrollTop } = e.currentTarget as Element;
      if (newScrollTop !== state.scrollTop) {
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
      mergedData,
      heights,
      props,
      getKey,
      collectHeight,
      syncScrollTop,
      () => {
        scrollBarRef.value?.delayHidden();
      },
    );

    expose({
      scrollTo,
    });

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

    // ================================ Effect ================================
    /** We need told outside that some list not rendered */
    watch(
      [() => calRes.start, () => calRes.end, mergedData],
      () => {
        if (props.onVisibleChange) {
          const renderList = mergedData.value.slice(calRes.start, calRes.end + 1);

          props.onVisibleChange(renderList, mergedData.value);
        }
      },
      { flush: 'post' },
    );
    const delayHideScrollBar = () => {
      scrollBarRef.value?.delayHidden();
    };
    return {
      state,
      mergedData,
      componentStyle,
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
      delayHideScrollBar,
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
      children = this.$slots.default,
      style,
      class: className,
      ...restProps
    } = { ...this.$props, ...this.$attrs } as any;
    const mergedClassName = classNames(prefixCls, className);
    const { scrollTop } = this.state;
    const { scrollHeight, offset, start, end } = this.calRes;
    const {
      componentStyle,
      onFallbackScroll,
      onScrollBar,
      useVirtual,
      collectHeight,
      sharedConfig,
      setInstance,
      mergedData,
      delayHideScrollBar,
    } = this;
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
          onMouseenter={delayHideScrollBar}
        >
          <Filler
            prefixCls={prefixCls}
            height={scrollHeight}
            offset={offset}
            onInnerResize={collectHeight}
            ref="fillerInnerRef"
            v-slots={{
              default: () =>
                renderChildren(mergedData, start, end, setInstance, children, sharedConfig),
            }}
          ></Filler>
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
