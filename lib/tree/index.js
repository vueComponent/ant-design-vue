'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeProps = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcTree = require('../vc-tree');

var _vcTree2 = _interopRequireDefault(_vcTree);

var _openAnimation = require('../_util/openAnimation');

var _openAnimation2 = _interopRequireDefault(_openAnimation);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var TreeProps = exports.TreeProps = function TreeProps() {
  return {
    treeNodes: _vueTypes2['default'].array,
    showLine: _vueTypes2['default'].bool,
    /** 是否支持多选 */
    multiple: _vueTypes2['default'].boolean,
    /** 是否自动展开父节点 */
    autoExpandParent: _vueTypes2['default'].boolean,
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: _vueTypes2['default'].bool,
    /** 是否支持选中 */
    checkable: _vueTypes2['default'].bool,
    /** 默认展开所有树节点 */
    defaultExpandAll: _vueTypes2['default'].bool,
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    /** （受控）展开指定的树节点 */
    expandedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    /** （受控）选中复选框的树节点 */
    checkedKeys: _vueTypes2['default'].oneOfType([_vueTypes2['default'].arrayOf(_vueTypes2['default'].string), _vueTypes2['default'].shape({
      checked: _vueTypes2['default'].arrayOf(String),
      halfChecked: _vueTypes2['default'].arrayOf(String)
    }).loose]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    /** （受控）设置选中的树节点 */
    selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    /** 默认选中的树节点 */
    defaultSelectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    /** 展开/收起节点时触发 */
    // onExpand?: (expandedKeys: Array<string>, info: { node: AntTreeNode, expanded: boolean }) => void | PromiseLike<any>;
    /** 点击复选框触发 */
    // onCheck?: (checkedKeys: Array<string>, e: AntTreeNodeEvent) => void;
    /** 点击树节点触发 */
    // onSelect?: (selectedKeys: Array<string>, e: AntTreeNodeEvent) => void;
    /** filter some AntTreeNodes as you need. it should return true */
    filterAntTreeNode: _vueTypes2['default'].func,
    /** 异步加载数据 */
    loadData: _vueTypes2['default'].func,
    /** 响应右键点击 */
    // onRightClick?: (options: AntTreeNodeMouseEvent) => void;
    /** 设置节点可拖拽（IE>8）*/
    draggable: _vueTypes2['default'].bool,
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
    prefixCls: _vueTypes2['default'].string,
    filterTreeNode: _vueTypes2['default'].func,
    showIcon: _vueTypes2['default'].bool,
    openAnimation: _vueTypes2['default'].any
  };
};

exports['default'] = {
  name: 'ATree',
  TreeNode: (0, _extends3['default'])({}, _vcTree.TreeNode, { name: 'ATreeNode' }),
  props: (0, _propsUtil.initDefaultProps)(TreeProps(), {
    prefixCls: 'ant-tree',
    checkable: false,
    showIcon: false,
    openAnimation: _openAnimation2['default']
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
            restProps = (0, _objectWithoutProperties3['default'])(item, ['children', 'on', 'slots', 'scopedSlots', 'key', 'class', 'style']);

        var treeNodeProps = {
          props: (0, _extends3['default'])({}, restProps, {
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
            _vcTree.TreeNode,
            treeNodeProps,
            [_this.renderTreeNodes(children)]
          );
        }
        return h(_vcTree.TreeNode, treeNodeProps);
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var prefixCls = props.prefixCls,
        checkable = props.checkable,
        treeNodes = props.treeNodes,
        restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'checkable', 'treeNodes']);
    var handelSelect = this.handelSelect,
        handleCheck = this.handleCheck,
        handleExpand = this.handleExpand,
        renderTreeNodes = this.renderTreeNodes;

    var vcTreeProps = {
      props: (0, _extends3['default'])({}, restProps, {
        prefixCls: prefixCls,
        checkable: checkable ? h('span', { 'class': prefixCls + '-checkbox-inner' }) : checkable
      }),
      on: (0, _extends3['default'])({}, this.$listeners, {
        check: handleCheck,
        select: handelSelect,
        expand: handleExpand
      })
    };
    return h(
      _vcTree2['default'],
      vcTreeProps,
      [treeNodes ? renderTreeNodes(treeNodes) : this.$slots['default']]
    );
  }
};