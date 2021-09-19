import type { PropType, ExtractPropTypes } from 'vue';
import { watchEffect, ref, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import VcTree, { TreeNode } from '../vc-tree';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { DataNode, EventDataNode, FieldNames, Key } from '../vc-tree/interface';
import type { TreeNodeProps } from '../vc-tree/props';
import { treeProps as vcTreeProps } from '../vc-tree/props';
import useConfigInject from '../_util/hooks/useConfigInject';
import renderSwitcherIcon from './utils/iconUtil';
import dropIndicatorRender from './utils/dropIndicator';
import devWarning from '../vc-util/devWarning';
import { warning } from '../vc-util/warning';

export interface AntdTreeNodeAttribute {
  eventKey: string;
  prefixCls: string;
  class: string;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  children: any;
  title: any;
  pos: string;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  isLeaf: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
}

export type AntTreeNodeProps = TreeNodeProps;

// [Legacy] Compatible for v2
export type TreeDataItem = DataNode;

export interface AntTreeNodeBaseEvent {
  node: EventDataNode;
  nativeEvent: MouseEvent;
}

export interface AntTreeNodeCheckedEvent extends AntTreeNodeBaseEvent {
  event: 'check';
  checked?: boolean;
  checkedNodes?: DataNode[];
}

export interface AntTreeNodeSelectedEvent extends AntTreeNodeBaseEvent {
  event: 'select';
  selected?: boolean;
  selectedNodes?: DataNode[];
}

export interface AntTreeNodeExpandedEvent extends AntTreeNodeBaseEvent {
  expanded?: boolean;
}

export interface AntTreeNodeMouseEvent {
  node: EventDataNode;
  event: DragEvent;
}

export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
  expandedKeys: Key[];
}

export interface AntTreeNodeDropEvent {
  node: EventDataNode;
  dragNode: EventDataNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap?: boolean;
  event: MouseEvent;
}

export const treeProps = () => {
  return {
    ...vcTreeProps(),
    showLine: { type: Boolean, default: undefined },
    /** 是否支持多选 */
    multiple: { type: Boolean, default: undefined },
    /** 是否自动展开父节点 */
    autoExpandParent: { type: Boolean, default: undefined },
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: { type: Boolean, default: undefined },
    /** 是否支持选中 */
    checkable: { type: Boolean, default: undefined },
    /** 是否禁用树 */
    disabled: { type: Boolean, default: undefined },
    /** 默认展开所有树节点 */
    defaultExpandAll: { type: Boolean, default: undefined },
    /** 默认展开对应树节点 */
    defaultExpandParent: { type: Boolean, default: undefined },
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: { type: Array as PropType<Key[]> },
    /** （受控）展开指定的树节点 */
    expandedKeys: { type: Array as PropType<Key[]> },
    /** （受控）选中复选框的树节点 */
    checkedKeys: {
      type: [Array, Object] as PropType<Key[] | { checked: Key[]; halfChecked: Key[] }>,
    },
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: { type: Array as PropType<Key[]> },
    /** （受控）设置选中的树节点 */
    selectedKeys: { type: Array as PropType<Key[]> },
    /** 默认选中的树节点 */
    defaultSelectedKeys: { type: Array as PropType<Key[]> },
    selectable: { type: Boolean, default: undefined },

    loadedKeys: { type: Array as PropType<Key[]> },
    draggable: { type: Boolean, default: undefined },
    showIcon: { type: Boolean, default: undefined },
    icon: { type: Function as PropType<(nodeProps: AntdTreeNodeAttribute) => any> },
    switcherIcon: PropTypes.any,
    prefixCls: PropTypes.string,
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: { type: Object as PropType<FieldNames> },
    blockNode: { type: Boolean, default: undefined },
    openAnimation: PropTypes.any,
  };
};

export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;

export default defineComponent({
  name: 'ATree',
  inheritAttrs: false,
  props: initDefaultProps(treeProps(), {
    checkable: false,
    selectable: true,
    showIcon: false,
    blockNode: false,
  }),
  slots: ['icon', 'title', 'switcherIcon', 'titleRender'],
  emits: [
    'update:selectedKeys',
    'update:checkedKeys',
    'update:expandedKeys',
    'expand',
    'select',
    'check',
    'doubleclick',
    'dblclick',
  ],
  TreeNode,
  setup(props, { attrs, expose, emit, slots }) {
    warning(
      !(props.treeData === undefined && slots.default),
      '`children` of Tree is deprecated. Please use `treeData` instead.',
    );
    const { prefixCls, direction, virtual } = useConfigInject('tree', props);
    const treeRef = ref();
    expose({
      treeRef,
      onNodeExpand: (...args) => {
        treeRef.value?.onNodeExpand(...args);
      },
    });

    watchEffect(() => {
      devWarning(
        props.replaceFields === undefined,
        'Tree',
        '`replaceFields` is deprecated, please use fieldNames instead',
      );
    });

    const handleCheck: TreeProps['onCheck'] = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };
    const handleExpand: TreeProps['onExpand'] = (expandedKeys, eventObj) => {
      emit('update:expandedKeys', expandedKeys);
      emit('expand', expandedKeys, eventObj);
    };
    const handleSelect: TreeProps['onSelect'] = (selectedKeys, eventObj) => {
      emit('update:selectedKeys', selectedKeys);
      emit('select', selectedKeys, eventObj);
    };
    return () => {
      const {
        showIcon,
        showLine,
        switcherIcon = slots.switcherIcon,
        icon = slots.icon,
        blockNode,
        checkable,
        selectable,
        fieldNames = props.replaceFields,
        motion = props.openAnimation,
        itemHeight = 28,
      } = props as TreeProps;
      const newProps = {
        ...attrs,
        ...props,
        showLine: Boolean(showLine),
        dropIndicatorRender,
        fieldNames,
        icon,
        itemHeight,
      };

      return (
        <VcTree
          {...newProps}
          virtual={virtual.value}
          motion={motion}
          ref={treeRef}
          prefixCls={prefixCls.value}
          class={classNames(
            {
              [`${prefixCls.value}-icon-hide`]: !showIcon,
              [`${prefixCls.value}-block-node`]: blockNode,
              [`${prefixCls.value}-unselectable`]: !selectable,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            attrs.class,
          )}
          direction={direction.value}
          checkable={checkable}
          selectable={selectable}
          switcherIcon={(nodeProps: AntTreeNodeProps) =>
            renderSwitcherIcon(prefixCls.value, switcherIcon, showLine, nodeProps)
          }
          onCheck={handleCheck}
          onExpand={handleExpand}
          onSelect={handleSelect}
          v-slots={{
            ...slots,
            checkable: () => <span class={`${prefixCls.value}-checkbox-inner`} />,
          }}
          children={filterEmpty(slots.default?.())}
        ></VcTree>
      );
    };
  },
});
