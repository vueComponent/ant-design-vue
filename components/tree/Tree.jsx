import { inject } from 'vue';
import classNames from '../_util/classNames';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import FileOutlined from '@ant-design/icons-vue/FileOutlined';
import CaretDownFilled from '@ant-design/icons-vue/CaretDownFilled';
import MinusSquareOutlined from '@ant-design/icons-vue/MinusSquareOutlined';
import PlusSquareOutlined from '@ant-design/icons-vue/PlusSquareOutlined';
import VcTree from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, getComponent, getSlot } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider';

const TreeNode = VcTree.TreeNode;
function TreeProps() {
  return {
    showLine: PropTypes.bool,
    /** 是否支持多选 */
    multiple: PropTypes.bool,
    /** 是否自动展开父节点 */
    autoExpandParent: PropTypes.bool,
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: PropTypes.bool,
    /** 是否支持选中 */
    checkable: PropTypes.bool,
    /** 是否禁用树 */
    disabled: PropTypes.bool,
    /** 默认展开所有树节点 */
    defaultExpandAll: PropTypes.bool,
    /** 默认展开对应树节点 */
    defaultExpandParent: PropTypes.bool,
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: PropTypes.array,
    /** （受控）展开指定的树节点 */
    expandedKeys: PropTypes.array,
    /** （受控）选中复选框的树节点 */
    checkedKeys: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        checked: PropTypes.array,
        halfChecked: PropTypes.array,
      }).loose,
    ]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: PropTypes.array,
    /** （受控）设置选中的树节点 */
    selectedKeys: PropTypes.array,
    /** 默认选中的树节点 */
    defaultSelectedKeys: PropTypes.array,
    selectable: PropTypes.bool,

    /** filter some AntTreeNodes as you need. it should return true */
    filterAntTreeNode: PropTypes.func,
    /** 异步加载数据 */
    loadData: PropTypes.func,
    loadedKeys: PropTypes.array,
    // onLoaded: (loadedKeys: string[], info: { event: 'load', node: AntTreeNode; }) => void,
    /** 响应右键点击 */
    // onRightClick: (options: AntTreeNodeMouseEvent) => void,
    /** 设置节点可拖拽（IE>8）*/
    draggable: PropTypes.bool,
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
    showIcon: PropTypes.bool,
    icon: PropTypes.func,
    switcherIcon: PropTypes.any,
    prefixCls: PropTypes.string,
    filterTreeNode: PropTypes.func,
    openAnimation: PropTypes.any,
    treeData: PropTypes.array,
    /**
     * @default{title,key,children}
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: PropTypes.object,
    blockNode: PropTypes.bool,
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

export default {
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
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  TreeNode,
  methods: {
    renderSwitcherIcon(prefixCls, switcherIcon, { isLeaf, loading, expanded }) {
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
    updateTreeData(treeData) {
      const { $slots } = this;
      const defaultFields = { children: 'children', title: 'title', key: 'key' };
      const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
      return treeData.map(item => {
        const key = item[replaceFields.key];
        const children = item[replaceFields.children];
        const { slots = {}, scopedSlots = {}, class: cls, style, ...restProps } = item;
        const treeNodeProps = {
          ...restProps,
          icon: $slots[scopedSlots.icon] || $slots[slots.icon] || restProps.icon,
          switcherIcon:
            $slots[scopedSlots.switcherIcon] ||
            $slots[slots.switcherIcon] ||
            restProps.switcherIcon,
          title: $slots[scopedSlots.title] || $slots[slots.title] || restProps[replaceFields.title],
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
    setTreeRef(node) {
      this.tree = node;
    },
    handleCheck(checkedObj, eventObj) {
      this.$emit('update:checkedKeys', checkedObj);
      this.$emit('check', checkedObj, eventObj);
    },
    handleExpand(expandedKeys, eventObj) {
      this.$emit('update:expandedKeys', expandedKeys);
      this.$emit('expand', expandedKeys, eventObj);
    },
    handleSelect(selectedKeys, eventObj) {
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
    };
    if (treeData) {
      vcTreeProps.treeData = treeData;
    }
    return <VcTree {...vcTreeProps} __propsSymbol__={[]} />;
  },
};
