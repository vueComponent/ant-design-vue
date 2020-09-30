import Filler from './Filler';
import Item from './Item';
import ScrollBar from './ScrollBar';
import useHeights from './hooks/useHeights';
import useScrollTo from './hooks/useScrollTo';
import useFrameWheel from './hooks/useFrameWheel';
import useMobileTouchMove from './hooks/useMobileTouchMove';
import useOriginScroll from './hooks/useOriginScroll';
import PropTypes from '../_util/vue-types';
import { computed, nextTick, onBeforeUnmount, reactive, watchEffect } from 'vue';
import classNames from '../_util/classNames';
import createRef from '../_util/createRef';

const EMPTY_DATA = [];

const ScrollStyle = {
  overflowY: 'auto',
  overflowAnchor: 'none',
};

function renderChildren(list, startIndex, endIndex, setNodeRef, renderFunc, { getKey }) {
  return list.slice(startIndex, endIndex + 1).map((item, index) => {
    const eleIndex = startIndex + index;
    const node = renderFunc(item, eleIndex, {
      // style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    });
    const key = getKey(item);
    return (
      <Item key={key} setRef={ele => setNodeRef(item, ele)}>
        {node}
      </Item>
    );
  });
}

const ListProps = {
  prefixCls: PropTypes.string,
  data: PropTypes.array,
  height: PropTypes.number,
  itemHeight: PropTypes.number,
  /** If not match virtual scroll condition, Set List still use height of container. */
  fullHeight: PropTypes.bool.def(true),
  itemKey: PropTypes.any,
  component: PropTypes.any,
  /** Set `false` will always use real scroll instead of virtual one */
  virtual: PropTypes.bool,
  children: PropTypes.func,
  onScroll: PropTypes.func,
};

const List = {
  props: ListProps,
  inheritAttrs: false,
  name: 'List',
  setup(props) {
    // ================================= MISC =================================

    const inVirtual = computed(() => {
      const { height, itemHeight, data, virtual } = props;
      return virtual !== false && height && itemHeight && data && itemHeight * data.length > height;
    });

    const state = reactive({
      scrollTop: 0,
      scrollMoving: false,
      mergedData: computed(() => props.data || EMPTY_DATA),
    });

    const componentRef = createRef();

    // =============================== Item Key ===============================
    const getKey = item => {
      if (typeof props.itemKey === 'function') {
        return props.itemKey(item);
      }
      return item[props.itemKey];
    };

    const sharedConfig = {
      getKey,
    };

    // ================================ Scroll ================================
    function syncScrollTop(newTop) {
      let value;
      if (typeof newTop === 'function') {
        value = newTop(state.scrollTop);
      } else {
        value = newTop;
      }

      const alignedTop = keepInRange(value);

      if (componentRef.current) {
        componentRef.current.scrollTop = alignedTop;
      }

      state.scrollTop = alignedTop;
    }

    // ================================ Height ================================
    const [setInstance, collectHeight, heights] = useHeights(getKey, null, null);

    // ========================== Visible Calculation =========================
    const calRes = computed(() => {
      if (!inVirtual.value) {
        return {
          scrollHeight: undefined,
          start: 0,
          end: state.mergedData.length - 1,
          offset: undefined,
        };
      }
      let itemTop = 0;
      let startIndex;
      let startOffset;
      let endIndex;
      const dataLen = state.mergedData.length;
      for (let i = 0; i < dataLen; i += 1) {
        const item = state.mergedData[i];
        const key = getKey(item);

        const cacheHeight = heights[key];
        const currentItemBottom =
          itemTop + (cacheHeight === undefined ? props.itemHeight : cacheHeight);

        if (currentItemBottom >= state.scrollTop && startIndex === undefined) {
          startIndex = i;
          startOffset = itemTop;
        }

        // Check item bottom in the range. We will render additional one item for motion usage
        if (currentItemBottom > state.scrollTop + props.height && endIndex === undefined) {
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
    const maxScrollHeight = computed(() => calRes.value.scrollHeight - props.height);

    function keepInRange(newScrollTop) {
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
    function onScrollBar(newScrollTop) {
      const newTop = newScrollTop;
      syncScrollTop(newTop);
    }

    // This code may only trigger in test case.
    // But we still need a sync if some special escape
    function onFallbackScroll(e) {
      const { scrollTop: newScrollTop } = e.currentTarget;
      if (newScrollTop !== state.scrollTop) {
        syncScrollTop(newScrollTop);
      }

      // Trigger origin onScroll
      props.onScroll?.(e);
    }

    // Since this added in global,should use ref to keep update
    const [onRawWheel, onFireFoxScroll] = useFrameWheel(
      inVirtual,
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
    useMobileTouchMove(inVirtual, componentRef, (deltaY, smoothOffset) => {
      if (originScroll(deltaY, smoothOffset)) {
        return false;
      }

      onRawWheel({ preventDefault() {}, deltaY });
      return true;
    });
    // Firefox only
    function onMozMousePixelScroll(e) {
      if (inVirtual.value) {
        e.preventDefault();
      }
    }
    const removeEventListener = () => {
      if (componentRef.current) {
        componentRef.current.removeEventListener('wheel', onRawWheel);
        componentRef.current.removeEventListener('DOMMouseScroll', onFireFoxScroll);
        componentRef.current.removeEventListener('MozMousePixelScroll', onMozMousePixelScroll);
      }
    };
    watchEffect(() => {
      nextTick(() => {
        if (componentRef.current) {
          removeEventListener();
          componentRef.current.addEventListener('wheel', onRawWheel);
          componentRef.current.addEventListener('DOMMouseScroll', onFireFoxScroll);
          componentRef.current.addEventListener('MozMousePixelScroll', onMozMousePixelScroll);
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
    );

    const componentStyle = computed(() => {
      let cs = null;
      if (props.height) {
        cs = { [props.fullHeight ? 'height' : 'maxHeight']: props.height + 'px', ...ScrollStyle };

        if (inVirtual.value) {
          cs.overflowY = 'hidden';

          if (state.scrollMoving) {
            cs.pointerEvents = 'none';
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
      inVirtual,
      calRes,
      collectHeight,
      setInstance,
      sharedConfig,
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
    } = { ...this.$props, ...this.$attrs };
    const mergedClassName = classNames(prefixCls, className);
    const { scrollTop, mergedData } = this.state;
    const { scrollHeight, offset, start, end } = this.calRes;
    const {
      componentStyle,
      onFallbackScroll,
      onScrollBar,
      componentRef,
      inVirtual,
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
          ref={componentRef}
          onScroll={onFallbackScroll}
        >
          <Filler
            prefixCls={prefixCls}
            height={scrollHeight}
            offset={offset}
            onInnerResize={collectHeight}
          >
            {listChildren}
          </Filler>
        </Component>

        {inVirtual && (
          <ScrollBar
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
};

export default List;
