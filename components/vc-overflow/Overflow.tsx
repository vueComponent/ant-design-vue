import type { CSSProperties, ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import { computed, defineComponent, shallowRef, watch } from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { Key, VueNode } from '../_util/type';
import PropTypes from '../_util/vue-types';
import { OverflowContextProvider } from './context';
import Item from './Item';
import RawItem from './RawItem';

const RESPONSIVE = 'responsive' as const;
const INVALIDATE = 'invalidate' as const;

function defaultRenderRest<ItemType>(omittedItems: ItemType[]) {
  return `+ ${omittedItems.length} ...`;
}

const overflowProps = () => {
  return {
    id: String,
    prefixCls: String,
    data: Array,
    itemKey: [String, Number, Function] as PropType<Key | ((item: any) => Key)>,
    /** Used for `responsive`. It will limit render node to avoid perf issue */
    itemWidth: { type: Number, default: 10 },
    renderItem: Function as PropType<(item: any) => VueNode>,
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawItem: Function as PropType<(item: any, index: number) => VueNode>,
    maxCount: [Number, String] as PropType<number | typeof RESPONSIVE | typeof INVALIDATE>,
    renderRest: Function as PropType<(items: any[]) => VueNode>,
    /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
    renderRawRest: Function as PropType<(items: any[]) => VueNode>,
    suffix: PropTypes.any,
    component: String,
    itemComponent: PropTypes.any,
    /** @private This API may be refactor since not well design */
    onVisibleChange: Function as PropType<(visibleCount: number) => void>,
    /** When set to `full`, ssr will render full items by default and remove at client side */
    ssr: String as PropType<'full'>,
    onMousedown: Function as PropType<MouseEventHandler>,
    role: String,
  };
};
type InterOverflowProps = Partial<ExtractPropTypes<ReturnType<typeof overflowProps>>>;
export type OverflowProps = HTMLAttributes & InterOverflowProps;
const Overflow = defineComponent({
  name: 'Overflow',
  inheritAttrs: false,
  props: overflowProps(),
  emits: ['visibleChange'],
  setup(props, { attrs, emit, slots }) {
    const fullySSR = computed(() => props.ssr === 'full');

    const containerWidth = shallowRef<number>(null);
    const mergedContainerWidth = computed(() => containerWidth.value || 0);
    const itemWidths = shallowRef<Map<Key, number>>(new Map<Key, number>());
    const prevRestWidth = shallowRef(0);
    const restWidth = shallowRef(0);
    const suffixWidth = shallowRef(0);
    const suffixFixedStart = shallowRef<number>(null);
    const displayCount = shallowRef<number>(null);

    const mergedDisplayCount = computed(() => {
      if (displayCount.value === null && fullySSR.value) {
        return Number.MAX_SAFE_INTEGER;
      }

      return displayCount.value || 0;
    });

    const restReady = shallowRef(false);

    const itemPrefixCls = computed(() => `${props.prefixCls}-item`);

    // Always use the max width to avoid blink
    const mergedRestWidth = computed(() => Math.max(prevRestWidth.value, restWidth.value));

    // ================================= Data =================================
    const isResponsive = computed(() => !!(props.data.length && props.maxCount === RESPONSIVE));
    const invalidate = computed(() => props.maxCount === INVALIDATE);

    /**
     * When is `responsive`, we will always render rest node to get the real width of it for calculation
     */
    const showRest = computed(
      () =>
        isResponsive.value ||
        (typeof props.maxCount === 'number' && props.data.length > props.maxCount),
    );

    const mergedData = computed(() => {
      let items = props.data;

      if (isResponsive.value) {
        if (containerWidth.value === null && fullySSR.value) {
          items = props.data;
        } else {
          items = props.data.slice(
            0,
            Math.min(props.data.length, mergedContainerWidth.value / props.itemWidth),
          );
        }
      } else if (typeof props.maxCount === 'number') {
        items = props.data.slice(0, props.maxCount);
      }

      return items;
    });

    const omittedItems = computed(() => {
      if (isResponsive.value) {
        return props.data.slice(mergedDisplayCount.value + 1);
      }
      return props.data.slice(mergedData.value.length);
    });

    // ================================= Item =================================
    const getKey = (item: any, index: number) => {
      if (typeof props.itemKey === 'function') {
        return props.itemKey(item);
      }
      return (props.itemKey && (item as any)?.[props.itemKey]) ?? index;
    };

    const mergedRenderItem = computed(() => props.renderItem || ((item: any) => item));

    const updateDisplayCount = (count: number, notReady?: boolean) => {
      displayCount.value = count;
      if (!notReady) {
        restReady.value = count < props.data.length - 1;

        emit('visibleChange', count);
      }
    };

    // ================================= Size =================================
    const onOverflowResize = (_: object, element: HTMLElement) => {
      containerWidth.value = element.clientWidth;
    };

    const registerSize = (key: Key, width: number | null) => {
      const clone = new Map(itemWidths.value);

      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      itemWidths.value = clone;
    };

    const registerOverflowSize = (_: Key, width: number | null) => {
      prevRestWidth.value = restWidth.value;
      restWidth.value = width!;
    };

    const registerSuffixSize = (_: Key, width: number | null) => {
      suffixWidth.value = width!;
    };

    // ================================ Effect ================================
    const getItemWidth = (index: number) => {
      return itemWidths.value.get(getKey(mergedData.value[index], index));
    };

    watch(
      [mergedContainerWidth, itemWidths, restWidth, suffixWidth, () => props.itemKey, mergedData],
      () => {
        if (mergedContainerWidth.value && mergedRestWidth.value && mergedData.value) {
          let totalWidth = suffixWidth.value;

          const len = mergedData.value.length;
          const lastIndex = len - 1;

          // When data count change to 0, reset this since not loop will reach
          if (!len) {
            updateDisplayCount(0);
            suffixFixedStart.value = null;
            return;
          }

          for (let i = 0; i < len; i += 1) {
            const currentItemWidth = getItemWidth(i);

            // Break since data not ready
            if (currentItemWidth === undefined) {
              updateDisplayCount(i - 1, true);
              break;
            }

            // Find best match
            totalWidth += currentItemWidth;

            if (
              // Only one means `totalWidth` is the final width
              (lastIndex === 0 && totalWidth <= mergedContainerWidth.value) ||
              // Last two width will be the final width
              (i === lastIndex - 1 &&
                totalWidth + getItemWidth(lastIndex)! <= mergedContainerWidth.value)
            ) {
              // Additional check if match the end
              updateDisplayCount(lastIndex);
              suffixFixedStart.value = null;
              break;
            } else if (totalWidth + mergedRestWidth.value > mergedContainerWidth.value) {
              // Can not hold all the content to show rest
              updateDisplayCount(i - 1);
              suffixFixedStart.value =
                totalWidth - currentItemWidth - suffixWidth.value + restWidth.value;
              break;
            }
          }

          if (props.suffix && getItemWidth(0) + suffixWidth.value > mergedContainerWidth.value) {
            suffixFixedStart.value = null;
          }
        }
      },
    );

    return () => {
      // ================================ Render ================================
      const displayRest = restReady.value && !!omittedItems.value.length;
      const {
        itemComponent,
        renderRawItem,
        renderRawRest,
        renderRest,
        prefixCls = 'rc-overflow',
        suffix,
        component: Component = 'div' as any,
        id,
        onMousedown,
      } = props;
      const { class: className, style, ...restAttrs } = attrs;
      let suffixStyle: CSSProperties = {};
      if (suffixFixedStart.value !== null && isResponsive.value) {
        suffixStyle = {
          position: 'absolute',
          left: `${suffixFixedStart.value}px`,
          top: 0,
        };
      }

      const itemSharedProps = {
        prefixCls: itemPrefixCls.value,
        responsive: isResponsive.value,
        component: itemComponent,
        invalidate: invalidate.value,
      };

      // >>>>> Choice render fun by `renderRawItem`
      const internalRenderItemNode = renderRawItem
        ? (item: any, index: number) => {
            const key = getKey(item, index);

            return (
              <OverflowContextProvider
                key={key}
                value={{
                  ...itemSharedProps,
                  order: index,
                  item,
                  itemKey: key,
                  registerSize,
                  display: index <= mergedDisplayCount.value,
                }}
              >
                {renderRawItem(item, index)}
              </OverflowContextProvider>
            );
          }
        : (item: any, index: number) => {
            const key = getKey(item, index);

            return (
              <Item
                {...itemSharedProps}
                order={index}
                key={key}
                item={item}
                renderItem={mergedRenderItem.value}
                itemKey={key}
                registerSize={registerSize}
                display={index <= mergedDisplayCount.value}
              />
            );
          };

      // >>>>> Rest node
      let restNode = () => null;
      const restContextProps = {
        order: displayRest ? mergedDisplayCount.value : Number.MAX_SAFE_INTEGER,
        className: `${itemPrefixCls.value} ${itemPrefixCls.value}-rest`,
        registerSize: registerOverflowSize,
        display: displayRest,
      };

      if (!renderRawRest) {
        const mergedRenderRest = renderRest || defaultRenderRest;

        restNode = () => (
          <Item
            {...itemSharedProps}
            // When not show, order should be the last
            {...restContextProps}
            v-slots={{
              default: () =>
                typeof mergedRenderRest === 'function'
                  ? mergedRenderRest(omittedItems.value)
                  : mergedRenderRest,
            }}
          ></Item>
        );
      } else if (renderRawRest) {
        restNode = () => (
          <OverflowContextProvider
            value={{
              ...itemSharedProps,
              ...restContextProps,
            }}
          >
            {renderRawRest(omittedItems.value)}
          </OverflowContextProvider>
        );
      }

      const overflowNode = () => (
        <Component
          id={id}
          class={classNames(!invalidate.value && prefixCls, className)}
          style={style}
          onMousedown={onMousedown}
          role={props.role}
          {...restAttrs}
        >
          {mergedData.value.map(internalRenderItemNode)}

          {/* Rest Count Item */}
          {showRest.value ? restNode() : null}

          {/* Suffix Node */}
          {suffix && (
            <Item
              {...itemSharedProps}
              order={mergedDisplayCount.value}
              class={`${itemPrefixCls.value}-suffix`}
              registerSize={registerSuffixSize}
              display
              style={suffixStyle}
              v-slots={{ default: () => suffix }}
            ></Item>
          )}
          {slots.default?.()}
        </Component>
      );
      // 使用 disabled  避免结构不一致 导致子组件 rerender
      return (
        <ResizeObserver
          disabled={!isResponsive.value}
          onResize={onOverflowResize}
          v-slots={{ default: overflowNode }}
        ></ResizeObserver>
      );
    };
  },
});

Overflow.Item = RawItem;
Overflow.RESPONSIVE = RESPONSIVE;
Overflow.INVALIDATE = INVALIDATE;

export default Overflow as typeof Overflow & {
  readonly Item: typeof RawItem;
  readonly RESPONSIVE: typeof RESPONSIVE;
  readonly INVALIDATE: typeof INVALIDATE;
};
