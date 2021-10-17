import type { DataNode, TreeDataNode, Key } from './interface';
import { useInjectTreeSelectContext } from './Context';
import type { RefOptionListProps } from '../vc-select/OptionList';
import type { ScrollTo } from '../vc-virtual-list/List';
import { computed, defineComponent, nextTick, ref, shallowRef, watch } from 'vue';
import { optionListProps } from './props';
import useMemo from '../_util/hooks/useMemo';
import type { EventDataNode } from '../tree';
import KeyCode from '../_util/KeyCode';
import Tree from '../vc-tree/Tree';
import type { TreeProps } from '../vc-tree/props';

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
  name: 'OptionList',
  inheritAttrs: false,
  props: optionListProps<DataNode>(),
  slots: ['notFoundContent', 'menuItemSelectedIcon'],
  setup(props, { slots, expose }) {
    const context = useInjectTreeSelectContext();

    const treeRef = ref();
    const memoOptions = useMemo(
      () => props.options,
      [() => props.open, () => props.options],
      (next, prev) => next[0] && prev[1] !== next[1],
    );

    const valueKeys = computed(() => {
      const { checkedKeys, getEntityByValue } = context.value;
      return checkedKeys.map(val => {
        const entity = getEntityByValue(val);
        return entity ? entity.key : null;
      });
    });

    const mergedCheckedKeys = computed(() => {
      const { checkable, halfCheckedKeys } = context.value;
      if (!checkable) {
        return null;
      }

      return {
        checked: valueKeys.value,
        halfChecked: halfCheckedKeys,
      };
    });

    watch(
      () => props.open,
      () => {
        nextTick(() => {
          if (props.open && !props.multiple && valueKeys.value.length) {
            treeRef.value?.scrollTo({ key: valueKeys.value[0] });
          }
        });
      },
      { immediate: true, flush: 'post' },
    );

    // ========================== Search ==========================
    const lowerSearchValue = computed(() => String(props.searchValue).toLowerCase());
    const filterTreeNode = (treeNode: EventDataNode) => {
      if (!lowerSearchValue.value) {
        return false;
      }
      return String(treeNode[context.value.treeNodeFilterProp])
        .toLowerCase()
        .includes(lowerSearchValue.value);
    };

    // =========================== Keys ===========================
    const expandedKeys = shallowRef<Key[]>(context.value.treeDefaultExpandedKeys);
    const searchExpandedKeys = shallowRef<Key[]>(null);

    watch(
      () => props.searchValue,
      () => {
        if (props.searchValue) {
          searchExpandedKeys.value = props.flattenOptions.map(o => o.key);
        }
      },
      {
        immediate: true,
      },
    );
    const mergedExpandedKeys = computed(() => {
      if (context.value.treeExpandedKeys) {
        return [...context.value.treeExpandedKeys];
      }
      return props.searchValue ? searchExpandedKeys.value : expandedKeys.value;
    });

    const onInternalExpand = (keys: Key[]) => {
      expandedKeys.value = keys;
      searchExpandedKeys.value = keys;

      context.value.onTreeExpand?.(keys);
    };

    // ========================== Events ==========================
    const onListMouseDown = (event: MouseEvent) => {
      event.preventDefault();
    };

    const onInternalSelect = (_: Key[], { node: { key } }: TreeEventInfo) => {
      const { getEntityByKey, checkable, checkedKeys } = context.value;
      const entity = getEntityByKey(key, checkable ? 'checkbox' : 'select');
      if (entity !== null) {
        props.onSelect?.(entity.data.value, {
          selected: !checkedKeys.includes(entity.data.value),
        });
      }

      if (!props.multiple) {
        props.onToggleOpen?.(false);
      }
    };

    // ========================= Keyboard =========================
    const activeKey = ref<Key>(null);
    const activeEntity = computed(() => context.value.getEntityByKey(activeKey.value));

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
            const { selectable, value } = activeEntity.value?.data.node || {};
            if (selectable !== false) {
              onInternalSelect(null, {
                node: { key: activeKey.value },
                selected: !context.value.checkedKeys.includes(value),
              });
            }
            break;
          }

          // >>> Close
          case KeyCode.ESC: {
            props.onToggleOpen(false);
          }
        }
      },
      onKeyup: () => {},
    } as ReviseRefOptionListProps);

    return () => {
      const {
        prefixCls,
        height,
        itemHeight,
        virtual,
        multiple,
        searchValue,
        open,
        notFoundContent = slots.notFoundContent?.(),
        onMouseenter,
      } = props;
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
      } = context.value;
      // ========================== Render ==========================
      if (memoOptions.value.length === 0) {
        return (
          <div role="listbox" class={`${prefixCls}-empty`} onMousedown={onListMouseDown}>
            {notFoundContent}
          </div>
        );
      }

      const treeProps: Partial<TreeProps> = {};
      if (treeLoadedKeys) {
        treeProps.loadedKeys = treeLoadedKeys;
      }
      if (mergedExpandedKeys.value) {
        treeProps.expandedKeys = mergedExpandedKeys.value;
      }
      return (
        <div onMousedown={onListMouseDown} onMouseenter={onMouseenter}>
          {activeEntity.value && open && (
            <span style={HIDDEN_STYLE} aria-live="assertive">
              {activeEntity.value.data.value}
            </span>
          )}

          <Tree
            ref={treeRef}
            focusable={false}
            prefixCls={`${prefixCls}-tree`}
            treeData={memoOptions.value as TreeDataNode[]}
            height={height}
            itemHeight={itemHeight}
            virtual={virtual}
            multiple={multiple}
            icon={treeIcon}
            showIcon={showTreeIcon}
            switcherIcon={switcherIcon}
            showLine={treeLine}
            loadData={searchValue ? null : (loadData as any)}
            motion={treeMotion}
            // We handle keys by out instead tree self
            checkable={checkable}
            checkStrictly
            checkedKeys={mergedCheckedKeys.value}
            selectedKeys={!checkable ? valueKeys.value : []}
            defaultExpandAll={treeDefaultExpandAll}
            {...treeProps}
            // Proxy event out
            onActiveChange={setActiveKey}
            onSelect={onInternalSelect}
            onCheck={onInternalSelect as any}
            onExpand={onInternalExpand}
            onLoad={onTreeLoad}
            filterTreeNode={filterTreeNode}
            v-slots={{ ...slots, checkable: context.value.customCheckable }}
          />
        </div>
      );
    };
  },
});
