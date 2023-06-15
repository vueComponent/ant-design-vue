import type { TreeDataNode, Key } from './interface';
import type { RefOptionListProps } from '../vc-select/OptionList';
import type { ScrollTo } from '../vc-virtual-list/List';
import { computed, defineComponent, nextTick, ref, shallowRef, toRaw, watch } from 'vue';
import useMemo from '../_util/hooks/useMemo';
import type { EventDataNode } from '../tree';
import KeyCode from '../_util/KeyCode';
import Tree from '../vc-tree/Tree';
import type { TreeProps } from '../vc-tree/props';
import { getAllKeys, isCheckDisabled } from './utils/valueUtil';
import { useBaseProps } from '../vc-select';
import useInjectLegacySelectContext from './LegacyContext';
import useInjectSelectContext from './TreeSelectContext';

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

interface TreeEventInfo {
  node: { key: Key };
  selected?: boolean;
  checked?: boolean;
}

type ReviseRefOptionListProps = Omit<RefOptionListProps, 'scrollTo'> & { scrollTo: ScrollTo };

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OptionList',
  inheritAttrs: false,
  setup(_, { slots, expose }) {
    const baseProps = useBaseProps();
    const legacyContext = useInjectLegacySelectContext();
    const context = useInjectSelectContext();
    const treeRef = ref();
    const memoTreeData = useMemo(
      () => context.treeData,
      [() => baseProps.open, () => context.treeData],
      next => next[0],
    );

    const mergedCheckedKeys = computed(() => {
      const { checkable, halfCheckedKeys, checkedKeys } = legacyContext;
      if (!checkable) {
        return null;
      }

      return {
        checked: checkedKeys,
        halfChecked: halfCheckedKeys,
      };
    });

    watch(
      () => baseProps.open,
      () => {
        nextTick(() => {
          if (baseProps.open && !baseProps.multiple && legacyContext.checkedKeys.length) {
            treeRef.value?.scrollTo({ key: legacyContext.checkedKeys[0] });
          }
        });
      },
      { immediate: true, flush: 'post' },
    );

    // ========================== Search ==========================
    const lowerSearchValue = computed(() => String(baseProps.searchValue).toLowerCase());
    const filterTreeNode = (treeNode: EventDataNode) => {
      if (!lowerSearchValue.value) {
        return false;
      }
      return String(treeNode[legacyContext.treeNodeFilterProp])
        .toLowerCase()
        .includes(lowerSearchValue.value);
    };

    // =========================== Keys ===========================
    const expandedKeys = shallowRef<Key[]>(legacyContext.treeDefaultExpandedKeys);
    const searchExpandedKeys = shallowRef<Key[]>(null);

    watch(
      () => baseProps.searchValue,
      () => {
        if (baseProps.searchValue) {
          searchExpandedKeys.value = getAllKeys(toRaw(context.treeData), toRaw(context.fieldNames));
        }
      },
      {
        immediate: true,
      },
    );
    const mergedExpandedKeys = computed(() => {
      if (legacyContext.treeExpandedKeys) {
        return legacyContext.treeExpandedKeys.slice();
      }
      return baseProps.searchValue ? searchExpandedKeys.value : expandedKeys.value;
    });

    const onInternalExpand = (keys: Key[]) => {
      expandedKeys.value = keys;
      searchExpandedKeys.value = keys;

      legacyContext.onTreeExpand?.(keys);
    };

    // ========================== Events ==========================
    const onListMouseDown = (event: MouseEvent) => {
      event.preventDefault();
    };

    const onInternalSelect = (_: Key[], { node }: TreeEventInfo) => {
      const { checkable, checkedKeys } = legacyContext;
      if (checkable && isCheckDisabled(node)) {
        return;
      }
      context.onSelect?.(node.key, {
        selected: !checkedKeys.includes(node.key),
      });

      if (!baseProps.multiple) {
        baseProps.toggleOpen?.(false);
      }
    };

    // ========================= Keyboard =========================
    const activeKey = ref<Key>(null);
    const activeEntity = computed(() => legacyContext.keyEntities[activeKey.value]);

    const setActiveKey = (key: Key) => {
      activeKey.value = key;
    };
    expose({
      scrollTo: (...args: any[]) => treeRef.value?.scrollTo?.(...args),
      onKeydown: (event: KeyboardEvent) => {
        const { which } = event;
        switch (which) {
          // >>> Arrow keys
          case KeyCode.UP:
          case KeyCode.DOWN:
          case KeyCode.LEFT:
          case KeyCode.RIGHT:
            treeRef.value?.onKeydown(event);
            break;

          // >>> Select item
          case KeyCode.ENTER: {
            if (activeEntity.value) {
              const { selectable, value } = activeEntity.value.node || {};
              if (selectable !== false) {
                onInternalSelect(null, {
                  node: { key: activeKey.value },
                  selected: !legacyContext.checkedKeys.includes(value),
                });
              }
            }

            break;
          }

          // >>> Close
          case KeyCode.ESC: {
            baseProps.toggleOpen(false);
          }
        }
      },
      onKeyup: () => {},
    } as ReviseRefOptionListProps);

    return () => {
      const {
        prefixCls,
        multiple,
        searchValue,
        open,
        notFoundContent = slots.notFoundContent?.(),
      } = baseProps;
      const { listHeight, listItemHeight, virtual, dropdownMatchSelectWidth, treeExpandAction } =
        context;
      const {
        checkable,
        treeDefaultExpandAll,
        treeIcon,
        showTreeIcon,
        switcherIcon,
        treeLine,
        loadData,
        treeLoadedKeys,
        treeMotion,
        onTreeLoad,
        checkedKeys,
      } = legacyContext;
      // ========================== Render ==========================
      if (memoTreeData.value.length === 0) {
        return (
          <div role="listbox" class={`${prefixCls}-empty`} onMousedown={onListMouseDown}>
            {notFoundContent}
          </div>
        );
      }

      const treeProps: Partial<TreeProps> = {
        fieldNames: context.fieldNames,
      };
      if (treeLoadedKeys) {
        treeProps.loadedKeys = treeLoadedKeys;
      }
      if (mergedExpandedKeys.value) {
        treeProps.expandedKeys = mergedExpandedKeys.value;
      }
      return (
        <div onMousedown={onListMouseDown}>
          {activeEntity.value && open && (
            <span style={HIDDEN_STYLE} aria-live="assertive">
              {activeEntity.value.node.value}
            </span>
          )}

          <Tree
            ref={treeRef}
            focusable={false}
            prefixCls={`${prefixCls}-tree`}
            treeData={memoTreeData.value as TreeDataNode[]}
            height={listHeight}
            itemHeight={listItemHeight}
            virtual={virtual !== false && dropdownMatchSelectWidth !== false}
            multiple={multiple}
            icon={treeIcon}
            showIcon={showTreeIcon}
            switcherIcon={switcherIcon}
            showLine={treeLine}
            loadData={searchValue ? null : (loadData as any)}
            motion={treeMotion}
            activeKey={activeKey.value}
            // We handle keys by out instead tree self
            checkable={checkable}
            checkStrictly
            checkedKeys={mergedCheckedKeys.value}
            selectedKeys={!checkable ? checkedKeys : []}
            defaultExpandAll={treeDefaultExpandAll}
            {...treeProps}
            // Proxy event out
            onActiveChange={setActiveKey}
            onSelect={onInternalSelect}
            onCheck={onInternalSelect as any}
            onExpand={onInternalExpand}
            onLoad={onTreeLoad}
            filterTreeNode={filterTreeNode}
            expandAction={treeExpandAction}
            v-slots={{ ...slots, checkable: legacyContext.customSlots.treeCheckable }}
          />
        </div>
      );
    };
  },
});
