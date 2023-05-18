import type { ExtractPropTypes } from 'vue';
import { watchEffect, ref, defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import VcTree from '../vc-tree';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { DataNode, EventDataNode, FieldNames, Key, ScrollTo } from '../vc-tree/interface';
import type { TreeNodeProps } from '../vc-tree/props';
import { treeProps as vcTreeProps } from '../vc-tree/props';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { SwitcherIconProps } from './utils/iconUtil';
import renderSwitcherIcon from './utils/iconUtil';
import dropIndicatorRender from './utils/dropIndicator';
import devWarning from '../vc-util/devWarning';
import { warning } from '../vc-util/warning';
import omit from '../_util/omit';
import { booleanType, someType, arrayType, functionType, objectType } from '../_util/type';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';

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
  const baseTreeProps = vcTreeProps();
  return {
    ...baseTreeProps,
    showLine: someType<boolean | { showLeafIcon: boolean }>([Boolean, Object]),
    /** 是否支持多选 */
    multiple: booleanType(),
    /** 是否自动展开父节点 */
    autoExpandParent: booleanType(),
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: booleanType(),
    /** 是否支持选中 */
    checkable: booleanType(),
    /** 是否禁用树 */
    disabled: booleanType(),
    /** 默认展开所有树节点 */
    defaultExpandAll: booleanType(),
    /** 默认展开对应树节点 */
    defaultExpandParent: booleanType(),
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: arrayType<Key[]>(),
    /** （受控）展开指定的树节点 */
    expandedKeys: arrayType<Key[]>(),
    /** （受控）选中复选框的树节点 */
    checkedKeys: someType<Key[] | { checked: Key[]; halfChecked: Key[] }>([Array, Object]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: arrayType<Key[]>(),
    /** （受控）设置选中的树节点 */
    selectedKeys: arrayType<Key[]>(),
    /** 默认选中的树节点 */
    defaultSelectedKeys: arrayType<Key[]>(),
    selectable: booleanType(),

    loadedKeys: arrayType<Key[]>(),
    draggable: booleanType(),
    showIcon: booleanType(),
    icon: functionType<(nodeProps: AntdTreeNodeAttribute) => any>(),
    switcherIcon: PropTypes.any,
    prefixCls: String,
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: objectType<FieldNames>(),
    blockNode: booleanType(),
    openAnimation: PropTypes.any,
    onDoubleclick: baseTreeProps.onDblclick,
    'onUpdate:selectedKeys': functionType<(keys: Key[]) => void>(),
    'onUpdate:checkedKeys': functionType<(keys: Key[]) => void>(),
    'onUpdate:expandedKeys': functionType<(keys: Key[]) => void>(),
  };
};

export type TreeProps = Partial<ExtractPropTypes<ReturnType<typeof treeProps>>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATree',
  inheritAttrs: false,
  props: initDefaultProps(treeProps(), {
    checkable: false,
    selectable: true,
    showIcon: false,
    blockNode: false,
  }),

  slots: Object as CustomSlotsType<{
    icon?: any;
    title?: any;
    switcherIcon?: any;
    titleRender?: any;
    default?: any;
    leafIcon?: any;
  }>,
  setup(props, { attrs, expose, emit, slots }) {
    warning(
      !(props.treeData === undefined && slots.default),
      '`children` of Tree is deprecated. Please use `treeData` instead.',
    );
    const { prefixCls, direction, virtual } = useConfigInject('tree', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const treeRef = ref();
    const scrollTo: ScrollTo = scroll => {
      treeRef.value?.scrollTo(scroll);
    };
    expose({
      treeRef,
      onNodeExpand: (...args) => {
        treeRef.value?.onNodeExpand(...args);
      },
      scrollTo,
      selectedKeys: computed(() => treeRef.value?.selectedKeys),
      checkedKeys: computed(() => treeRef.value?.checkedKeys),
      halfCheckedKeys: computed(() => treeRef.value?.halfCheckedKeys),
      loadedKeys: computed(() => treeRef.value?.loadedKeys),
      loadingKeys: computed(() => treeRef.value?.loadingKeys),
      expandedKeys: computed(() => treeRef.value?.expandedKeys),
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
        onDoubleclick,
        onDblclick,
      } = props as TreeProps;
      const newProps = {
        ...attrs,
        ...omit(props, [
          'onUpdate:checkedKeys',
          'onUpdate:expandedKeys',
          'onUpdate:selectedKeys',
          'onDoubleclick',
        ]),
        showLine: Boolean(showLine),
        dropIndicatorRender,
        fieldNames,
        icon,
        itemHeight,
      };
      const children = slots.default ? filterEmpty(slots.default()) : undefined;
      return wrapSSR(
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
            hashId.value,
          )}
          direction={direction.value}
          checkable={checkable}
          selectable={selectable}
          switcherIcon={(nodeProps: SwitcherIconProps) =>
            renderSwitcherIcon(prefixCls.value, switcherIcon, nodeProps, slots.leafIcon, showLine)
          }
          onCheck={handleCheck}
          onExpand={handleExpand}
          onSelect={handleSelect}
          onDblclick={onDblclick || onDoubleclick}
          v-slots={{
            ...slots,
            checkable: () => <span class={`${prefixCls.value}-checkbox-inner`} />,
          }}
          children={children}
        ></VcTree>,
      );
    };
  },
});
