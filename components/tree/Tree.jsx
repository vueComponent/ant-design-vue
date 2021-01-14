import warning from 'warning';
import { Tree as VcTree, TreeNode } from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import {
  initDefaultProps,
  getOptionProps,
  filterEmpty,
  getComponentFromProp,
  getListeners,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';

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
    /** 展开/收起节点时触发 */
    // onExpand: (expandedKeys: string[], info: AntTreeNodeExpandedEvent) => void | PromiseLike<any>,
    /** 点击复选框触发 */
    // onCheck: (checkedKeys: string[] | { checked: string[]; halfChecked: string[] }, e: AntTreeNodeCheckedEvent) => void,
    /** 点击树节点触发 */
    // onSelect: (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void,
    /** 单击树节点触发 */
    // onClick: (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => void,
    /** 双击树节点触发 */
    // onDoubleClick: (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => void,
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
    treeNodes: PropTypes.array,
    treeData: PropTypes.array,
    /**
     * @default{title,key,children}
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: PropTypes.object,
    blockNode: PropTypes.bool,
  };
}

export { TreeProps };

export default {
  name: 'ATree',
  model: {
    prop: 'checkedKeys',
    event: 'check',
  },
  props: initDefaultProps(TreeProps(), {
    checkable: false,
    showIcon: false,
    openAnimation: {
      on: animation,
      props: { appear: null },
    },
    blockNode: false,
  }),
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  created() {
    warning(
      !('treeNodes' in getOptionProps(this)),
      '`treeNodes` is deprecated. please use treeData instead.',
    );
  },
  TreeNode,
  methods: {
    renderSwitcherIcon(prefixCls, switcherIcon, { isLeaf, expanded, loading }) {
      const { showLine } = this.$props;
      if (loading) {
        return <Icon type="loading" class={`${prefixCls}-switcher-loading-icon`} />;
      }

      if (isLeaf) {
        return showLine ? <Icon type="file" class={`${prefixCls}-switcher-line-icon`} /> : null;
      }
      const switcherCls = `${prefixCls}-switcher-icon`;
      if (switcherIcon) {
        return cloneElement(switcherIcon, {
          class: {
            [switcherCls]: true,
          },
        });
      }
      return showLine ? (
        <Icon
          type={expanded ? 'minus-square' : 'plus-square'}
          class={`${prefixCls}-switcher-line-icon`}
          theme="outlined"
        />
      ) : (
        <Icon type="caret-down" class={switcherCls} theme="filled" />
      );
    },
    updateTreeData(treeData) {
      const { $slots, $scopedSlots } = this;
      const defaultFields = { children: 'children', title: 'title', key: 'key' };
      const replaceFields = { ...defaultFields, ...this.$props.replaceFields };
      return treeData.map(item => {
        const key = item[replaceFields.key];
        const children = item[replaceFields.children];
        const { on = {}, slots = {}, scopedSlots = {}, class: cls, style, ...restProps } = item;
        const treeNodeProps = {
          ...restProps,
          icon: $scopedSlots[scopedSlots.icon] || $slots[slots.icon] || restProps.icon,
          switcherIcon:
            $scopedSlots[scopedSlots.switcherIcon] ||
            $slots[slots.switcherIcon] ||
            restProps.switcherIcon,
          title:
            $scopedSlots[scopedSlots.title] ||
            $slots[slots.title] ||
            restProps[replaceFields.title],
          dataRef: item,
          on,
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
  },
  render() {
    const props = getOptionProps(this);
    const { $slots, $scopedSlots } = this;
    const { prefixCls: customizePrefixCls, showIcon, treeNodes, blockNode } = props;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('tree', customizePrefixCls);
    const switcherIcon = getComponentFromProp(this, 'switcherIcon');
    const checkable = props.checkable;
    let treeData = props.treeData || treeNodes;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    const vcTreeProps = {
      props: {
        ...props,
        prefixCls,
        checkable: checkable ? <span class={`${prefixCls}-checkbox-inner`} /> : checkable,
        children: filterEmpty($scopedSlots.default ? $scopedSlots.default() : $slots.default),
        __propsSymbol__: Symbol(),
        switcherIcon: nodeProps => this.renderSwitcherIcon(prefixCls, switcherIcon, nodeProps),
      },
      on: getListeners(this),
      ref: 'tree',
      class: {
        [`${prefixCls}-icon-hide`]: !showIcon,
        [`${prefixCls}-block-node`]: blockNode,
      },
    };
    if (treeData) {
      vcTreeProps.props.treeData = treeData;
    }
    return <VcTree {...vcTreeProps} />;
  },
};
