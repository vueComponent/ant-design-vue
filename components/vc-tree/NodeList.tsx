/**
 * Handle virtual list of the TreeNodes.
 */

import { computed, defineComponent, ref, shallowRef, watch } from 'vue';
import VirtualList from '../vc-virtual-list';
import omit from '../_util/omit';
import { useInjectKeysState, useInjectTreeContext } from './contextTypes';
import type { FlattenNode, DataEntity, DataNode, ScrollTo } from './interface';
import MotionTreeNode from './MotionTreeNode';
import type { NodeListProps } from './props';
import { nodeListProps } from './props';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';
import { getKey } from './utils/treeUtil';

const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0,
};

const noop = () => {};

export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;

const MotionNode: DataNode = {
  key: MOTION_KEY,
};

export const MotionEntity: DataEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: MotionNode,
  nodes: [MotionNode],
};

const MotionFlattenData: FlattenNode = {
  parent: null,
  children: [],
  pos: MotionEntity.pos,
  data: MotionNode,
  title: null,
  key: MOTION_KEY,
  /** Hold empty list here since we do not use it */
  isStart: [],
  isEnd: [],
};

export interface NodeListRef {
  scrollTo: ScrollTo;
  getIndentWidth: () => number;
}

/**
 * We only need get visible content items to play the animation.
 */
export function getMinimumRangeTransitionRange(
  list: FlattenNode[],
  virtual: boolean,
  height: number,
  itemHeight: number,
) {
  if (virtual === false || !height) {
    return list;
  }

  return list.slice(0, Math.ceil(height / itemHeight) + 1);
}

function itemKey(item: FlattenNode) {
  const { key, pos } = item;
  return getKey(key, pos);
}

function getAccessibilityPath(item: FlattenNode): string {
  let path = String(item.key);
  let current = item;

  while (current.parent) {
    current = current.parent;
    path = `${current.key} > ${path}`;
  }

  return path;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'NodeList',
  inheritAttrs: false,
  props: nodeListProps,
  setup(props, { expose, attrs }) {
    // =============================== Ref ================================
    const listRef = ref();
    const indentMeasurerRef = ref();
    const { expandedKeys, flattenNodes } = useInjectKeysState();
    expose({
      scrollTo: scroll => {
        listRef.value.scrollTo(scroll);
      },
      getIndentWidth: () => indentMeasurerRef.value.offsetWidth,
    });
    // ============================== Motion ==============================
    const transitionData = shallowRef<FlattenNode[]>(flattenNodes.value);
    const transitionRange = shallowRef([]);
    const motionType = ref<'show' | 'hide' | null>(null);

    function onMotionEnd() {
      transitionData.value = flattenNodes.value;
      transitionRange.value = [];
      motionType.value = null;

      props.onListChangeEnd();
    }

    const context = useInjectTreeContext();
    watch(
      [() => expandedKeys.value.slice(), flattenNodes],
      ([expandedKeys, data], [prevExpandedKeys, prevData]) => {
        const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);
        if (diffExpanded.key !== null) {
          const { virtual, height, itemHeight } = props;
          if (diffExpanded.add) {
            const keyIndex = prevData.findIndex(({ key }) => key === diffExpanded.key);
            const rangeNodes = getMinimumRangeTransitionRange(
              getExpandRange(prevData, data, diffExpanded.key),
              virtual,
              height,
              itemHeight,
            );

            const newTransitionData: FlattenNode[] = prevData.slice();
            newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

            transitionData.value = newTransitionData;
            transitionRange.value = rangeNodes;
            motionType.value = 'show';
          } else {
            const keyIndex = data.findIndex(({ key }) => key === diffExpanded.key);

            const rangeNodes = getMinimumRangeTransitionRange(
              getExpandRange(data, prevData, diffExpanded.key),
              virtual,
              height,
              itemHeight,
            );

            const newTransitionData: FlattenNode[] = data.slice();
            newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);

            transitionData.value = newTransitionData;
            transitionRange.value = rangeNodes;
            motionType.value = 'hide';
          }
        } else if (prevData !== data) {
          transitionData.value = data;
        }
      },
    );
    // We should clean up motion if is changed by dragging
    watch(
      () => context.value.dragging,
      dragging => {
        if (!dragging) {
          onMotionEnd();
        }
      },
    );

    const mergedData = computed(() =>
      props.motion === undefined ? transitionData.value : flattenNodes.value,
    );
    const onActiveChange = () => {
      props.onActiveChange(null);
    };
    return () => {
      const {
        prefixCls,
        selectable,
        checkable,
        disabled,

        motion,

        height,
        itemHeight,
        virtual,

        focusable,
        activeItem,
        focused,
        tabindex,

        onKeydown,
        onFocus,
        onBlur,

        onListChangeStart,
        onListChangeEnd,

        ...domProps
      } = { ...props, ...attrs } as NodeListProps;
      return (
        <>
          {focused && activeItem && (
            <span style={HIDDEN_STYLE} aria-live="assertive">
              {getAccessibilityPath(activeItem)}
            </span>
          )}

          <div>
            <input
              style={HIDDEN_STYLE}
              disabled={focusable === false || disabled}
              tabindex={focusable !== false ? tabindex : null}
              onKeydown={onKeydown}
              onFocus={onFocus}
              onBlur={onBlur}
              value=""
              onChange={noop}
              aria-label="for screen reader"
            />
          </div>

          <div
            class={`${prefixCls}-treenode`}
            aria-hidden
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
            }}
          >
            <div class={`${prefixCls}-indent`}>
              <div ref={indentMeasurerRef} class={`${prefixCls}-indent-unit`} />
            </div>
          </div>

          <VirtualList
            {...omit(domProps, ['onActiveChange'])}
            data={mergedData.value}
            itemKey={itemKey as any}
            height={height}
            fullHeight={false}
            virtual={virtual}
            itemHeight={itemHeight}
            prefixCls={`${prefixCls}-list`}
            ref={listRef}
            onVisibleChange={(originList, fullList) => {
              const originSet = new Set(originList);
              const restList = fullList.filter(item => !originSet.has(item));

              // Motion node is not render. Skip motion
              if (restList.some(item => itemKey(item) === MOTION_KEY)) {
                onMotionEnd();
              }
            }}
            v-slots={{
              default: (treeNode: FlattenNode) => {
                const {
                  pos,
                  data: { ...restProps },
                  title,
                  key,
                  isStart,
                  isEnd,
                } = treeNode;
                const mergedKey = getKey(key, pos);
                delete restProps.key;
                delete restProps.children;
                return (
                  <MotionTreeNode
                    {...restProps}
                    eventKey={mergedKey}
                    title={title}
                    active={!!activeItem && key === activeItem.key}
                    data={treeNode.data}
                    isStart={isStart}
                    isEnd={isEnd}
                    motion={motion}
                    motionNodes={key === MOTION_KEY ? transitionRange.value : null}
                    motionType={motionType.value}
                    onMotionStart={onListChangeStart}
                    onMotionEnd={onMotionEnd}
                    onMousemove={onActiveChange}
                  />
                );
              },
            }}
          ></VirtualList>
        </>
      );
    };
  },
});
