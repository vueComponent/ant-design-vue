import { getOptionProps, getStyle } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import BaseMixin from '../_util/BaseMixin';
import Filler from './Filler';
import {
  getNodeHeight,
  requireVirtual,
  getElementScrollPercentage,
  getRangeIndex,
  alignScrollTop,
  getItemAbsoluteTop,
  getItemRelativeTop,
  getScrollPercentage,
  getCompareItemRelativeTop,
  GHOST_ITEM_KEY,
} from './utils/itemUtil';
import { getIndexByStartLoc, findListDiffIndex } from './utils/algorithmUtil';

const ITEM_SCALE_RATE = 1;

const ScrollStyle = {
  overflowY: 'auto',
  overflowAnchor: 'none',
};

/**
 *
 * Virtual list display logic:
 * 1. scroll / initialize trigger measure
 * 2. Get location item of current `scrollTop`
 * 3. [Render] Render visible items
 * 4. Get all the visible items height
 * 5. [Render] Update top item `margin-top` to fit the position
 *
 * Algorithm:
 * We split scroll bar into equal slice. An item with whatever height occupy the same range slice.
 * When `scrollTop` change,
 * it will calculate the item percentage position and move item to the position.
 * Then calculate other item position base on the located item.
 *
 * Concept:
 *
 * # located item
 * The base position item which other items position calculate base on.
 */

export default {
  name: 'List',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    children: PropTypes.func,
    data: PropTypes.array,
    height: PropTypes.number,
    itemHeight: PropTypes.number,
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: PropTypes.bool,
    itemKey: PropTypes.any,
    component: PropTypes.string,
    /** Disable scroll check. Usually used on animation control */
    disabled: PropTypes.bool,
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: PropTypes.bool,
    /** When `disabled`, trigger if changed item not render. */
    onSkipRender: PropTypes.func,
  },
  data() {
    const props = getOptionProps(this);
    const { height, itemHeight, data, virtual } = props;
    this.cachedProps = props;
    this.itemElements = {};
    this.itemElementHeights = {};
    return {
      status: 'NONE',
      scrollTop: null,
      itemIndex: 0,
      itemOffsetPtg: 0,
      startIndex: 0,
      endIndex: 0,
      startItemTop: 0,
      isVirtual: requireVirtual(height, itemHeight, data.length, virtual),
      itemCount: data.length,
      ...this.getDerivedStateFromProps(props),
    };
  },
  watch: {
    disabled(val) {
      if (!val) {
        const props = getOptionProps(this);
        this.itemCount = props.data.length;
      }
    },
  },
  /**
   * Phase 1: Initial should sync with default scroll top
   */
  mounted() {
    if (this.$refs.list) {
      this.$refs.list.scrollTop = 0;
      this.onScroll(null);
    }
  },
  /**
   * Phase 4: Record used item height
   * Phase 5: Trigger re-render to use correct position
   */
  updated() {
    this.$nextTick(() => {
      const { status } = this.$data;
      const { data, height, itemHeight, disabled, onSkipRender, virtual } = getOptionProps(this);
      const prevData = this.cachedProps.data || [];

      let changedItemIndex = null;
      if (prevData.length !== data.length) {
        const diff = findListDiffIndex(prevData, data, this.getItemKey);
        changedItemIndex = diff ? diff.index : null;
      }

      if (disabled) {
        // Should trigger `onSkipRender` to tell that diff component is not render in the list
        if (data.length > prevData.length) {
          const { startIndex, endIndex } = this.$data;
          if (
            onSkipRender &&
            (changedItemIndex === null ||
              changedItemIndex < startIndex ||
              endIndex < changedItemIndex)
          ) {
            onSkipRender();
          }
        }
        return;
      }

      const isVirtual = requireVirtual(height, itemHeight, data.length, virtual);
      let nextStatus = status;
      if (this.$data.isVirtual !== isVirtual) {
        nextStatus = isVirtual ? 'SWITCH_TO_VIRTUAL' : 'SWITCH_TO_RAW';
        this.setState({
          isVirtual,
          status: nextStatus,
        });

        /**
         * We will wait a tick to let list turn to virtual list.
         * And then use virtual list sync logic to adjust the scroll.
         */
        if (nextStatus === 'SWITCH_TO_VIRTUAL') {
          return;
        }
      }

      if (status === 'MEASURE_START') {
        const { startIndex, itemIndex, itemOffsetPtg } = this.$data;
        const { scrollTop } = this.$refs.list;

        // Record here since measure item height will get warning in `render`
        this.collectItemHeights();

        // Calculate top visible item top offset
        const locatedItemTop = getItemAbsoluteTop({
          itemIndex,
          itemOffsetPtg,
          itemElementHeights: this.itemElementHeights,
          scrollTop,
          scrollPtg: getElementScrollPercentage(this.$refs.list),
          clientHeight: this.$refs.list.clientHeight,
          getItemKey: this.getIndexKey,
        });

        let startItemTop = locatedItemTop;
        for (let index = itemIndex - 1; index >= startIndex; index -= 1) {
          startItemTop -= this.itemElementHeights[this.getIndexKey(index)] || 0;
        }

        this.setState({
          status: 'MEASURE_DONE',
          startItemTop,
        });
      }

      if (status === 'SWITCH_TO_RAW') {
        /**
         * After virtual list back to raw list,
         * we update the `scrollTop` to real top instead of percentage top.
         */
        const {
          cacheScroll: { itemIndex, relativeTop },
        } = this.$data;
        let rawTop = relativeTop;
        for (let index = 0; index < itemIndex; index += 1) {
          rawTop -= this.itemElementHeights[this.getIndexKey(index)] || 0;
        }

        this.lockScroll = true;
        this.$refs.list.current.scrollTop = -rawTop;

        this.setState({
          status: 'MEASURE_DONE',
          itemIndex: 0,
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.lockScroll = false;
          });
        });
      } else if (prevData.length !== data.length && changedItemIndex !== null && height) {
        /**
         * Re-calculate the item position since `data` length changed.
         * [IMPORTANT] We use relative position calculate here.
         */
        let { itemIndex: originItemIndex } = this.$data;
        const {
          itemOffsetPtg: originItemOffsetPtg,
          startIndex: originStartIndex,
          endIndex: originEndIndex,
          scrollTop: originScrollTop,
        } = this.$data;

        // 1. Refresh item heights
        this.collectItemHeights();

        // 1. Get origin located item top
        let originLocatedItemRelativeTop;

        if (this.$data.status === 'SWITCH_TO_VIRTUAL') {
          originItemIndex = 0;
          originLocatedItemRelativeTop = -this.$data.scrollTop;
        } else {
          originLocatedItemRelativeTop = getItemRelativeTop({
            itemIndex: originItemIndex,
            itemOffsetPtg: originItemOffsetPtg,
            itemElementHeights: this.itemElementHeights,
            scrollPtg: getScrollPercentage({
              scrollTop: originScrollTop,
              scrollHeight: prevData.length * itemHeight,
              clientHeight: this.$refs.list.current.clientHeight,
            }),
            clientHeight: this.$refs.list.current.clientHeight,
            getItemKey: index => this.getIndexKey(index, this.cachedProps),
          });
        }

        // 2. Find the compare item
        let originCompareItemIndex = changedItemIndex - 1;
        // Use next one since there are not more item before removed
        if (originCompareItemIndex < 0) {
          originCompareItemIndex = 0;
        }

        // 3. Find the compare item top
        const originCompareItemTop = getCompareItemRelativeTop({
          locatedItemRelativeTop: originLocatedItemRelativeTop,
          locatedItemIndex: originItemIndex,
          compareItemIndex: originCompareItemIndex,
          startIndex: originStartIndex,
          endIndex: originEndIndex,
          getItemKey: index => this.getIndexKey(index, this.cachedProps),
          itemElementHeights: this.itemElementHeights,
        });

        if (nextStatus === 'SWITCH_TO_RAW') {
          /**
           * We will record current measure relative item top and apply in raw list after list turned
           */
          this.setState({
            cacheScroll: {
              itemIndex: originCompareItemIndex,
              relativeTop: originCompareItemTop,
            },
          });
        } else {
          this.internalScrollTo({
            itemIndex: originCompareItemIndex,
            relativeTop: originCompareItemTop,
          });
        }
      } else if (nextStatus === 'SWITCH_TO_RAW') {
        // This is only trigger when height changes that all items can show in raw
        // Let's reset back to top
        this.setState({
          cacheScroll: {
            itemIndex: 0,
            relativeTop: 0,
          },
        });
      }

      this.cachedProps = getOptionProps(this);
    });
  },
  methods: {
    getDerivedStateFromProps(nextProps) {
      if (!nextProps.disabled) {
        return {
          itemCount: nextProps.data.length,
        };
      }

      return null;
    },
    /**
     * Phase 2: Trigger render since we should re-calculate current position.
     */
    onScroll(e) {
      const { data, height, itemHeight, disabled } = this.$props;

      const { scrollTop: originScrollTop, clientHeight, scrollHeight } = this.$refs.list;
      const scrollTop = alignScrollTop(originScrollTop, scrollHeight - clientHeight);

      // Skip if `scrollTop` not change to avoid shake
      if (scrollTop === this.$data.scrollTop || this.lockScroll || disabled) {
        return;
      }

      const scrollPtg = getElementScrollPercentage(this.$refs.list);
      const visibleCount = Math.ceil(height / itemHeight);

      const { itemIndex, itemOffsetPtg, startIndex, endIndex } = getRangeIndex(
        scrollPtg,
        data.length,
        visibleCount,
      );

      this.setState({
        status: 'MEASURE_START',
        scrollTop,
        itemIndex,
        itemOffsetPtg,
        startIndex,
        endIndex,
      });

      this.triggerOnScroll(e);
    },
    onRawScroll(e) {
      const { scrollTop } = this.$refs.list;
      this.setState({ scrollTop });
      this.triggerOnScroll(e);
    },
    triggerOnScroll(e) {
      if (e) {
        this.$emit('scroll', e);
      }
    },
    /**
     * Phase 4: Render item and get all the visible items height
     */
    renderChildren(list, startIndex, renderFunc) {
      const { status } = this.$data;
      // We should measure rendered item height
      return list.map((item, index) => {
        const eleIndex = startIndex + index;
        const node = renderFunc(item, eleIndex, {
          style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
        });
        const eleKey = this.getIndexKey(eleIndex);

        // Pass `key` and `ref` for internal measure
        return cloneElement(node, {
          key: eleKey,
          ref: eleKey,
        });
      });
    },
    getIndexKey(index, props) {
      const mergedProps = props || getOptionProps(this);
      const { data = [] } = mergedProps;

      // Return ghost key as latest index item
      if (index === data.length) {
        return GHOST_ITEM_KEY;
      }

      const item = data[index];
      if (!item) {
        /* istanbul ignore next */
        console.error('Not find index item. Please report this since it is a bug.');
      }

      return this.getItemKey(item, mergedProps);
    },
    getItemKey(item, props) {
      const { itemKey } = props || getOptionProps(this);

      return typeof itemKey === 'function' ? itemKey(item) : item[itemKey];
    },
    /**
     * Collect current rendered dom element item heights
     */
    collectItemHeights(range) {
      const { startIndex, endIndex } = range || this.$data;
      const { data } = getOptionProps(this);

      // Record here since measure item height will get warning in `render`
      for (let index = startIndex; index <= endIndex; index += 1) {
        const item = data[index];

        // Only collect exist item height
        if (item) {
          const eleKey = this.getItemKey(item);
          this.itemElementHeights[eleKey] = getNodeHeight(this.refs[`itemElement-${eleKey}`]);
        }
      }
    },
    internalScrollTo(relativeScroll) {
      const { itemIndex: compareItemIndex, relativeTop: compareItemRelativeTop } = relativeScroll;
      const { scrollTop: originScrollTop } = this.$data;
      const { data, itemHeight, height } = getOptionProps(this);

      // 1. Find the best match compare item top
      let bestSimilarity = Number.MAX_VALUE;
      let bestScrollTop = null;
      let bestItemIndex = null;
      let bestItemOffsetPtg = null;
      let bestStartIndex = null;
      let bestEndIndex = null;

      let missSimilarity = 0;

      const scrollHeight = data.length * itemHeight;
      const { clientHeight } = this.$refs.list;
      const maxScrollTop = scrollHeight - clientHeight;

      for (let i = 0; i < maxScrollTop; i += 1) {
        const scrollTop = getIndexByStartLoc(0, maxScrollTop, originScrollTop, i);

        const scrollPtg = getScrollPercentage({ scrollTop, scrollHeight, clientHeight });
        const visibleCount = Math.ceil(height / itemHeight);

        const { itemIndex, itemOffsetPtg, startIndex, endIndex } = getRangeIndex(
          scrollPtg,
          data.length,
          visibleCount,
        );

        // No need to check if compare item out of the index to save performance
        if (startIndex <= compareItemIndex && compareItemIndex <= endIndex) {
          // 1.1 Get measure located item relative top
          const locatedItemRelativeTop = getItemRelativeTop({
            itemIndex,
            itemOffsetPtg,
            itemElementHeights: this.itemElementHeights,
            scrollPtg,
            clientHeight,
            getItemKey: this.getIndexKey,
          });

          const compareItemTop = getCompareItemRelativeTop({
            locatedItemRelativeTop,
            locatedItemIndex: itemIndex,
            compareItemIndex, // Same as origin index
            startIndex,
            endIndex,
            getItemKey: this.getIndexKey,
            itemElementHeights: this.itemElementHeights,
          });

          // 1.2 Find best match compare item top
          const similarity = Math.abs(compareItemTop - compareItemRelativeTop);
          if (similarity < bestSimilarity) {
            bestSimilarity = similarity;
            bestScrollTop = scrollTop;
            bestItemIndex = itemIndex;
            bestItemOffsetPtg = itemOffsetPtg;
            bestStartIndex = startIndex;
            bestEndIndex = endIndex;

            missSimilarity = 0;
          } else {
            missSimilarity += 1;
          }
        }

        // If keeping 10 times not match similarity,
        // check more scrollTop is meaningless.
        // Here boundary is set to 10.
        if (missSimilarity > 10) {
          break;
        }
      }

      // 2. Re-scroll if has best scroll match
      if (bestScrollTop !== null) {
        this.lockScroll = true;
        this.$refs.list.current.scrollTop = bestScrollTop;

        this.setState({
          status: 'MEASURE_START',
          scrollTop: bestScrollTop,
          itemIndex: bestItemIndex,
          itemOffsetPtg: bestItemOffsetPtg,
          startIndex: bestStartIndex,
          endIndex: bestEndIndex,
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.lockScroll = false;
          });
        });
      }
    },
  },
  render() {
    const { isVirtual, itemCount } = this.$data;
    const {
      prefixCls,
      height,
      itemHeight,
      fullHeight = true,
      component: Component = 'div',
      data,
      children,
      itemKey,
      onSkipRender,
      disabled,
      virtual,
      ...restProps
    } = getOptionProps(this);
    const style = getStyle(this);

    if (!isVirtual) {
      /**
       * Virtual list switch is works on component updated.
       * We should double check here if need cut the content.
       */
      const shouldVirtual = requireVirtual(height, itemHeight, data.length, virtual);

      return (
        <Component
          style={
            height
              ? { ...style, [fullHeight ? 'height' : 'maxHeight']: height, ...ScrollStyle }
              : style
          }
          {...restProps}
          onScroll={this.onRawScroll}
          ref="list"
        >
          <Filler prefixCls={prefixCls} height={height}>
            {this.renderChildren(
              shouldVirtual ? data.slice(0, Math.ceil(height / itemHeight)) : data,
              0,
              children,
            )}
          </Filler>
        </Component>
      );
    }

    // Use virtual list
    const mergedStyle = {
      ...style,
      height,
      ...ScrollStyle,
    };

    const { status, startIndex, endIndex, startItemTop } = this.$data;
    const contentHeight = itemCount * itemHeight * ITEM_SCALE_RATE;

    return (
      <Component style={mergedStyle} {...restProps} onScroll={this.onScroll} ref="list">
        <Filler
          prefixCls={prefixCls}
          height={contentHeight}
          offset={status === 'MEASURE_DONE' ? startItemTop : 0}
        >
          {this.renderChildren(data.slice(startIndex, endIndex + 1), startIndex, children)}
        </Filler>
      </Component>
    );
  },
};
