import type { ExtractPropTypes } from 'vue';
import { nextTick, onUpdated, ref, watch, defineComponent, computed } from 'vue';
import debounce from 'lodash-es/debounce';
import FolderOpenOutlined from '@ant-design/icons-vue/FolderOpenOutlined';
import FolderOutlined from '@ant-design/icons-vue/FolderOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import classNames from '../_util/classNames';
import type { AntdTreeNodeAttribute, TreeProps } from './Tree';
import Tree, { treeProps } from './Tree';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import {
  convertDataToEntities,
  convertTreeToData,
  fillFieldNames,
} from '../vc-tree/utils/treeUtil';
import type { DataNode, EventDataNode, Key, ScrollTo } from '../vc-tree/interface';
import { conductExpandParent } from '../vc-tree/util';
import { calcRangeKeys, convertDirectoryKeysToNodes } from './utils/dictUtil';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { filterEmpty } from '../_util/props-util';
import { someType } from '../_util/type';
import type { CustomSlotsType } from '../_util/type';

export type ExpandAction = false | 'click' | 'doubleclick' | 'dblclick';

export const directoryTreeProps = () => ({
  ...treeProps(),
  expandAction: someType<ExpandAction>([Boolean, String]),
});

export type DirectoryTreeProps = Partial<ExtractPropTypes<ReturnType<typeof directoryTreeProps>>>;

function getIcon(props: AntdTreeNodeAttribute) {
  const { isLeaf, expanded } = props;
  if (isLeaf) {
    return <FileOutlined />;
  }
  return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADirectoryTree',
  inheritAttrs: false,
  props: initDefaultProps(directoryTreeProps(), {
    showIcon: true,
    expandAction: 'click',
  }),
  slots: Object as CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
  }>,

  // emits: [
  //   'update:selectedKeys',
  //   'update:checkedKeys',
  //   'update:expandedKeys',
  //   'expand',
  //   'select',
  //   'check',
  //   'doubleclick',
  //   'dblclick',
  //   'click',
  // ],
  setup(props, { attrs, slots, emit, expose }) {
    // convertTreeToData 兼容 a-tree-node 历史写法，未来a-tree-node移除后，删除相关代码，不要再render中调用 treeData，否则死循环
    const treeData = ref<DataNode[]>(
      props.treeData || convertTreeToData(filterEmpty(slots.default?.())),
    );

    watch(
      () => props.treeData,
      () => {
        treeData.value = props.treeData;
      },
    );
    onUpdated(() => {
      nextTick(() => {
        if (props.treeData === undefined && slots.default) {
          treeData.value = convertTreeToData(filterEmpty(slots.default?.()));
        }
      });
    });
    // Shift click usage
    const lastSelectedKey = ref<Key>();

    const cachedSelectedKeys = ref<Key[]>();
    const fieldNames = computed(() => fillFieldNames(props.fieldNames));
    const treeRef = ref();
    const scrollTo: ScrollTo = scroll => {
      treeRef.value?.scrollTo(scroll);
    };
    expose({
      scrollTo,
      selectedKeys: computed(() => treeRef.value?.selectedKeys),
      checkedKeys: computed(() => treeRef.value?.checkedKeys),
      halfCheckedKeys: computed(() => treeRef.value?.halfCheckedKeys),
      loadedKeys: computed(() => treeRef.value?.loadedKeys),
      loadingKeys: computed(() => treeRef.value?.loadingKeys),
      expandedKeys: computed(() => treeRef.value?.expandedKeys),
    });
    const getInitExpandedKeys = () => {
      const { keyEntities } = convertDataToEntities(treeData.value, {
        fieldNames: fieldNames.value,
      });

      let initExpandedKeys: any;

      // Expanded keys
      if (props.defaultExpandAll) {
        initExpandedKeys = Object.keys(keyEntities);
      } else if (props.defaultExpandParent) {
        initExpandedKeys = conductExpandParent(
          props.expandedKeys || props.defaultExpandedKeys || [],
          keyEntities,
        );
      } else {
        initExpandedKeys = props.expandedKeys || props.defaultExpandedKeys;
      }
      return initExpandedKeys;
    };

    const selectedKeys = ref(props.selectedKeys || props.defaultSelectedKeys || []);

    const expandedKeys = ref<Key[]>(getInitExpandedKeys());

    watch(
      () => props.selectedKeys,
      () => {
        if (props.selectedKeys !== undefined) {
          selectedKeys.value = props.selectedKeys;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.expandedKeys,
      () => {
        if (props.expandedKeys !== undefined) {
          expandedKeys.value = props.expandedKeys;
        }
      },
      { immediate: true },
    );

    const expandFolderNode = (event: MouseEvent, node: any) => {
      const { isLeaf } = node;

      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      // Call internal rc-tree expand function
      // https://github.com/ant-design/ant-design/issues/12567
      treeRef.value!.onNodeExpand(event as any, node);
    };
    const onDebounceExpand = debounce(expandFolderNode, 200, {
      leading: true,
    });
    const onExpand = (
      keys: Key[],
      info: {
        node: EventDataNode;
        expanded: boolean;
        nativeEvent: MouseEvent;
      },
    ) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
      // Call origin function
      emit('update:expandedKeys', keys);
      emit('expand', keys, info);
    };

    const onClick = (event: MouseEvent, node: EventDataNode) => {
      const { expandAction } = props;

      // Expand the tree
      if (expandAction === 'click') {
        onDebounceExpand(event, node);
      }
      emit('click', event, node);
    };

    const onDoubleClick = (event: MouseEvent, node: EventDataNode) => {
      const { expandAction } = props;
      // Expand the tree
      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        onDebounceExpand(event, node);
      }

      emit('doubleclick', event, node);
      emit('dblclick', event, node);
    };
    const onSelect = (
      keys: Key[],
      event: {
        event: 'select';
        selected: boolean;
        node: any;
        selectedNodes: DataNode[];
        nativeEvent: MouseEvent;
      },
    ) => {
      const { multiple } = props;
      const { node, nativeEvent } = event;
      const key = node[fieldNames.value.key];
      // const newState: DirectoryTreeState = {};

      // We need wrap this event since some value is not same
      const newEvent: any = {
        ...event,
        selected: true, // Directory selected always true
      };

      // Windows / Mac single pick
      const ctrlPick: boolean = nativeEvent?.ctrlKey || nativeEvent?.metaKey;
      const shiftPick: boolean = nativeEvent?.shiftKey;

      // Generate new selected keys
      let newSelectedKeys: Key[];
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys;
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(
          new Set([
            ...(cachedSelectedKeys.value || []),
            ...calcRangeKeys({
              treeData: treeData.value,
              expandedKeys: expandedKeys.value,
              startKey: key,
              endKey: lastSelectedKey.value,
              fieldNames: fieldNames.value,
            }),
          ]),
        );
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      } else {
        // Single click
        newSelectedKeys = [key];
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(
          treeData.value,
          newSelectedKeys,
          fieldNames.value,
        );
      }

      emit('update:selectedKeys', newSelectedKeys);
      emit('select', newSelectedKeys, newEvent);
      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }
    };

    const onCheck: TreeProps['onCheck'] = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };

    const { prefixCls, direction } = useConfigInject('tree', props);

    return () => {
      const connectClassName = classNames(
        `${prefixCls.value}-directory`,
        {
          [`${prefixCls.value}-directory-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
      );
      const { icon = slots.icon, blockNode = true, ...otherProps } = props;
      return (
        <Tree
          {...attrs}
          icon={icon || getIcon}
          ref={treeRef}
          blockNode={blockNode}
          {...otherProps}
          prefixCls={prefixCls.value}
          class={connectClassName}
          expandedKeys={expandedKeys.value}
          selectedKeys={selectedKeys.value}
          onSelect={onSelect}
          onClick={onClick}
          onDblclick={onDoubleClick}
          onExpand={onExpand}
          onCheck={onCheck}
          v-slots={slots}
        />
      );
    };
  },
});
