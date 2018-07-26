import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import VcTree, { TreeNode } from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';

// export interface AntTreeNodeProps {
//   disabled: PropTypes.bool,
//   disableCheckbox: PropTypes.bool,
//   title?: string | React.ReactNode;
//   key?: string;
//   isLeaf: PropTypes.bool,
//   children?: React.ReactNode;
// }

// export interface AntTreeNode extends React.Component<AntTreeNodeProps, {}> {}

// export interface AntTreeNodeEvent {
//   event: 'check' | 'select';
//   node: AntTreeNode;
//   checked: PropTypes.bool,
//   checkedNodes?: Array<AntTreeNode>;
//   selected: PropTypes.bool,
//   selectedNodes?: Array<AntTreeNode>;
// }

// export interface AntTreeNodeMouseEvent {
//   node: AntTreeNode;
//   event: React.MouseEventHandler<any>;
// }

export var TreeProps = function TreeProps() {
  return {
    treeNodes: PropTypes.array,
    showLine: PropTypes.bool,
    /** 是否支持多选 */
    multiple: PropTypes.boolean,
    /** 是否自动展开父节点 */
    autoExpandParent: PropTypes.boolean,
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: PropTypes.bool,
    /** 是否支持选中 */
    checkable: PropTypes.bool,
    /** 默认展开所有树节点 */
    defaultExpandAll: PropTypes.bool,
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    /** （受控）展开指定的树节点 */
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    /** （受控）选中复选框的树节点 */
    checkedKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({
      checked: PropTypes.arrayOf(String),
      halfChecked: PropTypes.arrayOf(String)
    }).loose]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    /** （受控）设置选中的树节点 */
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    /** 默认选中的树节点 */
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    /** 展开/收起节点时触发 */
    // onExpand?: (expandedKeys: Array<string>, info: { node: AntTreeNode, expanded: boolean }) => void | PromiseLike<any>;
    /** 点击复选框触发 */
    // onCheck?: (checkedKeys: Array<string>, e: AntTreeNodeEvent) => void;
    /** 点击树节点触发 */
    // onSelect?: (selectedKeys: Array<string>, e: AntTreeNodeEvent) => void;
    /** filter some AntTreeNodes as you need. it should return true */
    filterAntTreeNode: PropTypes.func,
    /** 异步加载数据 */
    loadData: PropTypes.func,
    /** 响应右键点击 */
    // onRightClick?: (options: AntTreeNodeMouseEvent) => void;
    /** 设置节点可拖拽（IE>8）*/
    draggable: PropTypes.bool,
    // /** 开始拖拽时调用 */
    // onDragStart?: (options: AntTreeNodeMouseEvent) => void;
    // /** dragenter 触发时调用 */
    // onDragEnter?: (options: AntTreeNodeMouseEvent) => void;
    // /** dragover 触发时调用 */
    // onDragOver?: (options: AntTreeNodeMouseEvent) => void;
    // /** dragleave 触发时调用 */
    // onDragLeave?: (options: AntTreeNodeMouseEvent) => void;
    // /** drop 触发时调用 */
    // onDrop?: (options: AntTreeNodeMouseEvent) => void;
    prefixCls: PropTypes.string,
    filterTreeNode: PropTypes.func,
    showIcon: PropTypes.bool,
    openAnimation: PropTypes.any
  };
};

export default {
  name: 'ATree',
  TreeNode: _extends({}, TreeNode, { name: 'ATreeNode' }),
  props: initDefaultProps(TreeProps(), {
    prefixCls: 'ant-tree',
    checkable: false,
    showIcon: false,
    openAnimation: animation
  }),
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  methods: {
    handleCheck: function handleCheck(checkedKeys, e) {
      this.$emit('check', checkedKeys, e);
    },
    handelSelect: function handelSelect(selectedKeys, e) {
      this.$emit('select', selectedKeys, e);
      this.$emit('update:select', selectedKeys);
    },
    handleExpand: function handleExpand(expandedKeys, info) {
      this.$emit('expand', expandedKeys, info);
      this.$emit('update:expand', expandedKeys);
    },
    renderTreeNodes: function renderTreeNodes() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var h = this.$createElement;
      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;

      return data.map(function (item) {
        var children = item.children,
            _item$on = item.on,
            on = _item$on === undefined ? {} : _item$on,
            _item$slots = item.slots,
            slots = _item$slots === undefined ? {} : _item$slots,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots,
            key = item.key,
            cls = item['class'],
            style = item.style,
            restProps = _objectWithoutProperties(item, ['children', 'on', 'slots', 'scopedSlots', 'key', 'class', 'style']);

        var treeNodeProps = {
          props: _extends({}, restProps, {
            icon: restProps.icon || $slots[slots.icon] || $scopedSlots[scopedSlots.icon] && $scopedSlots[scopedSlots.icon],
            title: restProps.title || $slots[slots.title] || ($scopedSlots[scopedSlots.title] && $scopedSlots[scopedSlots.title])(item),
            dataRef: item
          }),
          on: on,
          key: key,
          'class': cls,
          style: style
        };
        if (children) {
          return h(
            TreeNode,
            treeNodeProps,
            [_this.renderTreeNodes(children)]
          );
        }
        return h(TreeNode, treeNodeProps);
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);

    var prefixCls = props.prefixCls,
        checkable = props.checkable,
        treeNodes = props.treeNodes,
        restProps = _objectWithoutProperties(props, ['prefixCls', 'checkable', 'treeNodes']);

    var handelSelect = this.handelSelect,
        handleCheck = this.handleCheck,
        handleExpand = this.handleExpand,
        renderTreeNodes = this.renderTreeNodes;

    var vcTreeProps = {
      props: _extends({}, restProps, {
        prefixCls: prefixCls,
        checkable: checkable ? h('span', { 'class': prefixCls + '-checkbox-inner' }) : checkable
      }),
      on: _extends({}, this.$listeners, {
        check: handleCheck,
        select: handelSelect,
        expand: handleExpand
      })
    };
    return h(
      VcTree,
      vcTreeProps,
      [treeNodes ? renderTreeNodes(treeNodes) : this.$slots['default']]
    );
  }
};