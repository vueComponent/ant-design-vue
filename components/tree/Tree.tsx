import type { PropType, ExtractPropTypes } from 'vue';
import { ref } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import VcTree, { TreeNode } from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import type { DataNode, DragNodeEvent, FieldNames, Key } from '../vc-tree/interface';
import { treeProps as vcTreeProps } from '../vc-tree/props';
import useConfigInject from '../_util/hooks/useConfigInject';
import renderSwitcherIcon from './utils/iconUtil';
import dropIndicatorRender from './utils/dropIndicator';

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

export type AntTreeNodeProps = DataNode;

// [Legacy] Compatible for v2
export type TreeDataItem = DataNode;

export interface AntTreeNodeBaseEvent {
  node: DataNode;
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
  node: DataNode;
  event: DragEvent;
}

export interface AntTreeNodeDragEnterEvent extends AntTreeNodeMouseEvent {
  expandedKeys: Key[];
}

export interface AntTreeNodeDropEvent {
  node: DragNodeEvent;
  dragNode: DragNodeEvent;
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
    openAnimation: {
      ...animation,
      appear: false,
    },
    blockNode: false,
  }),
  slots: ['icon', 'title', 'switcherIcon'],
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
    const { prefixCls, direction, virtual } = useConfigInject('tree', props);
    const treeRef = ref();
    expose({
      treeRef,
      onNodeExpand: (...args) => {
        treeRef.value?.onNodeExpand(...args);
      },
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
        switcherIcon = slots.switcherIcon?.(),
        icon = slots.icon,
        blockNode,
        checkable,
        selectable,
        fieldNames,
        replaceFields,
      } = props;
      const newProps = {
        ...attrs,
        ...props,
        showLine: Boolean(showLine),
        dropIndicatorRender,
        fieldNames: fieldNames || (replaceFields as FieldNames),
        icon,
      };

      return (
        <VcTree
          itemHeight={20}
          virtual={virtual.value}
          {...newProps}
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
  // methods: {
  //   renderSwitcherIcon(prefixCls: string, switcherIcon: VNode, { isLeaf, loading, expanded }) {
  //     const { showLine } = this.$props;
  //     if (loading) {
  //       return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />;
  //     }

  //     if (isLeaf) {
  //       return showLine ? <FileOutlined class={`${prefixCls}-switcher-line-icon`} /> : null;
  //     }
  //     const switcherCls = `${prefixCls}-switcher-icon`;
  //     if (switcherIcon) {
  //       return cloneElement(switcherIcon, {
  //         class: switcherCls,
  //       });
  //     }
  //     return showLine ? (
  //       expanded ? (
  //         <MinusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
  //       ) : (
  //         <PlusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
  //       )
  //     ) : (
  //       <CaretDownFilled class={switcherCls} />
  //     );
  //   },
  //   updateTreeData(treeData: TreeDataItem[]) {
  //     const { $slots } = this;
  //     const defaultFields = { children: 'children', title: 'title', key: 'key' };
  //     const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
  //     return treeData.map(item => {
  //       const key = item[replaceFields.key];
  //       const children = item[replaceFields.children];
  //       const { slots = {}, class: cls, style, ...restProps } = item;
  //       const treeNodeProps = {
  //         ...restProps,
  //         icon: $slots[slots.icon] || restProps.icon,
  //         switcherIcon: $slots[slots.switcherIcon] || restProps.switcherIcon,
  //         title: $slots[slots.title] || $slots.title || restProps[replaceFields.title],
  //         dataRef: item,
  //         key,
  //         class: cls,
  //         style,
  //       };
  //       if (children) {
  //         return { ...treeNodeProps, children: this.updateTreeData(children) };
  //       }
  //       return treeNodeProps;
  //     });
  //   },
  //   setTreeRef(node: VNode) {
  //     this.tree = node;
  //   },
  //   handleCheck(checkedObj: (number | string)[], eventObj: CheckEvent) {
  //     this.$emit('update:checkedKeys', checkedObj);
  //     this.$emit('check', checkedObj, eventObj);
  //   },
  //   handleExpand(expandedKeys: (number | string)[], eventObj: ExpendEvent) {
  //     this.$emit('update:expandedKeys', expandedKeys);
  //     this.$emit('expand', expandedKeys, eventObj);
  //   },
  //   handleSelect(selectedKeys: (number | string)[], eventObj: SelectEvent) {
  //     this.$emit('update:selectedKeys', selectedKeys);
  //     this.$emit('select', selectedKeys, eventObj);
  //   },
  // },
  // render() {
  //   const props = getOptionProps(this);
  //   const { prefixCls: customizePrefixCls, showIcon, treeNodes, blockNode } = props;
  //   const getPrefixCls = this.configProvider.getPrefixCls;
  //   const prefixCls = getPrefixCls('tree', customizePrefixCls);
  //   const switcherIcon = getComponent(this, 'switcherIcon');
  //   const checkable = props.checkable;
  //   let treeData = props.treeData || treeNodes;
  //   if (treeData) {
  //     treeData = this.updateTreeData(treeData);
  //   }
  //   const { class: className, ...restAttrs } = this.$attrs;
  //   const vcTreeProps = {
  //     ...props,
  //     prefixCls,
  //     checkable: checkable ? <span class={`${prefixCls}-checkbox-inner`} /> : checkable,
  //     children: getSlot(this),
  //     switcherIcon: nodeProps => this.renderSwitcherIcon(prefixCls, switcherIcon, nodeProps),
  //     ref: this.setTreeRef,
  //     ...restAttrs,
  //     class: classNames(className, {
  //       [`${prefixCls}-icon-hide`]: !showIcon,
  //       [`${prefixCls}-block-node`]: blockNode,
  //     }),
  //     onCheck: this.handleCheck,
  //     onExpand: this.handleExpand,
  //     onSelect: this.handleSelect,
  //   } as Record<string, any>;
  //   if (treeData) {
  //     vcTreeProps.treeData = treeData;
  //   }
  //   return <VcTree {...vcTreeProps} />;
  // },
});
