import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import warning from 'warning';
import { Tree as VcTree, TreeNode } from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, filterEmpty } from '../_util/props-util';
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
    checkedKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({
      checked: PropTypes.array,
      halfChecked: PropTypes.array
    }).loose]),
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
    prefixCls: PropTypes.string,
    filterTreeNode: PropTypes.func,
    openAnimation: PropTypes.any,
    treeNodes: PropTypes.array,
    treeData: PropTypes.array,
    /**
     * @default{title,key,children}
     * 替换treeNode中 title,key,children字段为本地数据中对应的字段
     */
    replaceFields:PropTypes.object
  };
}

export { TreeProps };

export default {
  name: 'ATree',
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  props: initDefaultProps(TreeProps(), {
    prefixCls: 'ant-tree',
    checkable: false,
    showIcon: false,
    replaceFields:{
      children:'children',
      title:'title',
      key:'key'
    },
    openAnimation: {
      on: animation,
      props: { appear: null }
    }
  }),
  created: function created() {
    warning(!('treeNodes' in getOptionProps(this)), '`treeNodes` is deprecated. please use treeData instead.');
  },

  TreeNode: TreeNode,
  methods: {
    renderSwitcherIcon: function renderSwitcherIcon(_ref) {
      var isLeaf = _ref.isLeaf,
          expanded = _ref.expanded,
          loading = _ref.loading;
      var h = this.$createElement;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          showLine = _$props.showLine;

      if (loading) {
        return h(Icon, {
          attrs: { type: 'loading' },
          'class': prefixCls + '-switcher-loading-icon' });
      }
      if (showLine) {
        if (isLeaf) {
          return h(Icon, {
            attrs: { type: 'file' },
            'class': prefixCls + '-switcher-line-icon' });
        }
        return h(Icon, {
          attrs: {
            type: expanded ? 'minus-square' : 'plus-square',

            theme: 'outlined'
          },
          'class': prefixCls + '-switcher-line-icon' });
      } else {
        if (isLeaf) {
          return null;
        }
        return h(Icon, {
          attrs: { type: 'caret-down', theme: 'filled' },
          'class': prefixCls + '-switcher-icon' });
      }
    },
    updataTreeData: function updataTreeData(treeData) {
      var _this = this;
      var replaceFields = this.$props.replaceFields
      var defalutFields = { children:'children', title:'title', key:'key' }
      replaceFields = { ...defalutFields,  ...replaceFields }

      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;

      return treeData.map(function (item) {
        var children = item[replaceFields.children],
            _item$on = item.on,
            on = _item$on === undefined ? {} : _item$on,
            _item$slots = item.slots,
            slots = _item$slots === undefined ? {} : _item$slots,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots,
            key = item[replaceFields.key],
            cls = item['class'],
            style = item.style,
            restProps = _objectWithoutProperties(item, ['children', 'on', 'slots', 'scopedSlots', 'key', 'class', 'style']);

        var treeNodeProps = _extends({}, restProps, {
          icon: $slots[slots.icon] || $scopedSlots[scopedSlots.icon] && $scopedSlots[scopedSlots.icon] || restProps.icon,
          title: $slots[slots.title] || $scopedSlots[scopedSlots.title] && $scopedSlots[scopedSlots.title](item) || restProps[replaceFields.title],
          dataRef: item,
          on: on,
          key: key,
          'class': cls,
          style: style
        });
        if (children) {
          return _extends({}, treeNodeProps, { children: _this.updataTreeData(children) });
        }
        return treeNodeProps;
      });
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var prefixCls = props.prefixCls,
        showIcon = props.showIcon,
        treeNodes = props.treeNodes;

    var checkable = props.checkable;
    var treeData = props.treeData || treeNodes;
    if (treeData) {
      treeData = this.updataTreeData(treeData);
    }
    var vcTreeProps = {
      props: _extends({}, props, {
        checkable: checkable ? h('span', { 'class': prefixCls + '-checkbox-inner' }) : checkable,
        children: filterEmpty(this.$slots['default'] || []),
        __propsSymbol__: Symbol(),
        switcherIcon: this.renderSwitcherIcon
      }),
      on: this.$listeners,
      ref: 'tree',
      'class': !showIcon && prefixCls + '-icon-hide'
    };
    if (treeData) {
      vcTreeProps.props.treeData = treeData;
    }
    return h(VcTree, vcTreeProps);
  }
};
