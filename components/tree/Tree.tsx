import type { VNode, PropType, CSSProperties } from 'vue';
import { defineComponent, inject } from 'vue';
import classNames from '../_util/classNames';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import CaretDownFilled from '@ant-design/icons-vue/CaretDownFilled';
import MinusSquareOutlined from '@ant-design/icons-vue/MinusSquareOutlined';
import PlusSquareOutlined from '@ant-design/icons-vue/PlusSquareOutlined';
import VcTree from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponent, getSlot } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { cloneElement } from '../_util/vnode';
import { defaultConfigProvider } from '../config-provider';

const TreeNode = VcTree.TreeNode;

export interface TreeDataItem {
  key?: string | number;
  title?: string;
  isLeaf?: boolean;
  selectable?: boolean;
  children?: TreeDataItem[];
  disableCheckbox?: boolean;
  disabled?: boolean;
  class?: string;
  style?: CSSProperties;
  checkable?: boolean;
  icon?: VNode;
  slots?: Record<string, string>;
  switcherIcon?: VNode;
  // support custom field
  [key: string]: any;
}

interface DefaultEvent {
  nativeEvent: MouseEvent;
  node: Record<string, any>;
}

export interface CheckEvent extends DefaultEvent {
  checked: boolean;
  checkedNodes: Array<Record<string, any>>;
  checkedNodesPositions: { node: Record<string, any>; pos: string | number }[];
  event: string;
  halfCheckedKeys: (string | number)[];
}

export interface ExpendEvent extends DefaultEvent {
  expanded: boolean;
}

export interface SelectEvent extends DefaultEvent {
  event: string;
  selected: boolean;
  selectedNodes: Array<Record<string, any>>;
}

export interface TreeDragEvent {
  event: DragEvent;
  expandedKeys: (string | number)[];
  node: Record<string, any>;
}

export interface DropEvent {
  dragNode: Record<string, any>;
  dragNodesKeys: (string | number)[];
  dropPosition: number;
  dropToGap: boolean;
  event: DragEvent;
  node: Record<string, any>;
}

function TreeProps() {
  return {
    showLine: PropTypes.looseBool,
    /** 是否支持多选 */
    multiple: PropTypes.looseBool,
    /** 是否自动展开父节点 */
    autoExpandParent: PropTypes.looseBool,
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: PropTypes.looseBool,
    /** 是否支持选中 */
    checkable: PropTypes.looseBool,
    /** 是否禁用树 */
    disabled: PropTypes.looseBool,
    /** 默认展开所有树节点 */
    defaultExpandAll: PropTypes.looseBool,
    /** 默认展开对应树节点 */
    defaultExpandParent: PropTypes.looseBool,
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    /** （受控）展开指定的树节点 */
    expandedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    /** （受控）选中复选框的树节点 */
    checkedKeys: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
      PropTypes.shape({
        checked: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        halfChecked: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
      }).loose,
    ]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    /** （受控）设置选中的树节点 */
    selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    /** 默认选中的树节点 */
    defaultSelectedKeys: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    selectable: PropTypes.looseBool,

    /** filter some AntTreeNodes as you need. it should return true */
    filterAntTreeNode: PropTypes.func,
    /** 异步加载数据 */
    loadData: PropTypes.func,
    loadedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    // onLoaded: (loadedKeys: string[], info: { event: 'load', node: AntTreeNode; }) => void,
    /** 响应右键点击 */
    // onRightClick: (options: AntTreeNodeMouseEvent) => void,
    /** 设置节点可拖拽（IE>8）*/
    draggable: PropTypes.looseBool,
    // /** 开始拖拽时调用 */
    // onDragStart: (options: AntTreeNodeMouseEvent) => void,
    // /** dragenter 触发时调用 */
    // onDragEnter: (options: AntTreeNodeMouseEvent) => void,
    // /** dragover 触发时调用 */
    // onDragOver: (options: AntTreeNodeMouseEvent) => void,
    // /** dragleave 触发时调用 */
    // onDragLeave: (options: AntTreeNodeMouseEvent) => void,
    // /** drop 触发时调用 */
    // onDrop: (options: AntTreeNodeMouseEvent) => void,
    showIcon: PropTypes.looseBool,
    icon: PropTypes.func,
    switcherIcon: PropTypes.any,
    prefixCls: PropTypes.string,
    filterTreeNode: PropTypes.func,
    openAnimation: PropTypes.any,
    treeData: {
      type: Array as PropType<TreeDataItem[]>,
    },
    /**
     * @default{title,key,children}
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: PropTypes.object,
    blockNode: PropTypes.looseBool,
    /** 展开/收起节点时触发 */
    onExpand: PropTypes.func,
    /** 点击复选框触发 */
    onCheck: PropTypes.func,
    /** 点击树节点触发 */
    onSelect: PropTypes.func,
    /** 单击树节点触发 */
    onClick: PropTypes.func,
    /** 双击树节点触发 */
    onDoubleclick: PropTypes.func,
    onDblclick: PropTypes.func,
    'onUpdate:selectedKeys': PropTypes.func,
    'onUpdate:checkedKeys': PropTypes.func,
    'onUpdate:expandedKeys': PropTypes.func,
  };
}

export { TreeProps };

export default defineComponent({
  name: 'ATree',
  inheritAttrs: false,
  props: initDefaultProps(TreeProps(), {
    checkable: false,
    showIcon: false,
    openAnimation: {
      ...animation,
      appear: null,
    },
    blockNode: false,
  }),
  setup() {
    return {
      tree: null,
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  TreeNode,
  methods: {
    renderSwitcherIcon(prefixCls: string, switcherIcon: VNode, { isLeaf, loading, expanded }) {
      const { showLine } = this.$props;
      if (loading) {
        return <LoadingOutlined class={`${prefixCls}-switcher-loading-icon`} />;
      }

      if (isLeaf) {
        return showLine ? <FileOutlined class={`${prefixCls}-switcher-line-icon`} /> : null;
      }
      const switcherCls = `${prefixCls}-switcher-icon`;
      if (switcherIcon) {
        return cloneElement(switcherIcon, {
          class: switcherCls,
        });
      }
      return showLine ? (
        expanded ? (
          <MinusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
        ) : (
          <PlusSquareOutlined class={`${prefixCls}-switcher-line-icon`} />
        )
      ) : (
        <CaretDownFilled class={switcherCls} />
      );
    },
    updateTreeData(treeData: TreeDataItem[]) {
      const { $slots } = this;
      const defaultFields = { children: 'children', title: 'title', key: 'key' };
      const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
      return treeData.map(item => {
        const key = item[replaceFields.key];
        const children = item[replaceFields.children];
        const { slots = {}, class: cls, style, ...restProps } = item;
        const treeNodeProps = {
          ...restProps,
          icon: $slots[slots.icon] || restProps.icon,
          switcherIcon: $slots[slots.switcherIcon] || restProps.switcherIcon,
          title: $slots[slots.title] || $slots.title || restProps[replaceFields.title],
          dataRef: item,
          key,
          class: cls,
          style,
        };
        if (children) {
          return { ...treeNodeProps, children: this.updateTreeData(children) };
        }
        return treeNodeProps;
      });
    },
    setTreeRef(node: VNode) {
      this.tree = node;
    },
    handleCheck(checkedObj: (number | string)[], eventObj: CheckEvent) {
      this.$emit('update:checkedKeys', checkedObj);
      this.$emit('check', checkedObj, eventObj);
    },
    handleExpand(expandedKeys: (number | string)[], eventObj: ExpendEvent) {
      this.$emit('update:expandedKeys', expandedKeys);
      this.$emit('expand', expandedKeys, eventObj);
    },
    handleSelect(selectedKeys: (number | string)[], eventObj: SelectEvent) {
      this.$emit('update:selectedKeys', selectedKeys);
      this.$emit('select', selectedKeys, eventObj);
    },
  },
  render() {
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, showIcon, treeNodes, blockNode } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tree', customizePrefixCls);
    const switcherIcon = getComponent(this, 'switcherIcon');
    const checkable = props.checkable;
    let treeData = props.treeData || treeNodes;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    const { class: className, ...restAttrs } = this.$attrs;
    const vcTreeProps = {
      ...props,
      prefixCls,
      checkable: checkable ? <span class={`${prefixCls}-checkbox-inner`} /> : checkable,
      children: getSlot(this),
      switcherIcon: nodeProps => this.renderSwitcherIcon(prefixCls, switcherIcon, nodeProps),
      ref: this.setTreeRef,
      ...restAttrs,
      class: classNames(className, {
        [`${prefixCls}-icon-hide`]: !showIcon,
        [`${prefixCls}-block-node`]: blockNode,
      }),
      onCheck: this.handleCheck,
      onExpand: this.handleExpand,
      onSelect: this.handleSelect,
    } as Record<string, any>;
    if (treeData) {
      vcTreeProps.treeData = treeData;
    }
    return <VcTree {...vcTreeProps} __propsSymbol__={[]} />;
  },
});
