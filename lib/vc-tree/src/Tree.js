'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */

var Tree = {
  name: 'Tree',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    prefixCls: _vueTypes2['default'].string,
    showLine: _vueTypes2['default'].bool,
    showIcon: _vueTypes2['default'].bool,
    icon: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].func]),
    focusable: _vueTypes2['default'].bool,
    selectable: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    multiple: _vueTypes2['default'].bool,
    checkable: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
    checkStrictly: _vueTypes2['default'].bool,
    draggable: _vueTypes2['default'].bool,
    defaultExpandParent: _vueTypes2['default'].bool,
    autoExpandParent: _vueTypes2['default'].bool,
    defaultExpandAll: _vueTypes2['default'].bool,
    defaultExpandedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    expandedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    defaultCheckedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    checkedKeys: _vueTypes2['default'].oneOfType([_vueTypes2['default'].arrayOf(_vueTypes2['default'].string), _vueTypes2['default'].object]),
    defaultSelectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    // onExpand: PropTypes.func,
    // onCheck: PropTypes.func,
    // onSelect: PropTypes.func,
    loadData: _vueTypes2['default'].func,
    // onMouseEnter: PropTypes.func,
    // onMouseLeave: PropTypes.func,
    // onRightClick: PropTypes.func,
    // onDragStart: PropTypes.func,
    // onDragEnter: PropTypes.func,
    // onDragOver: PropTypes.func,
    // onDragLeave: PropTypes.func,
    // onDragEnd: PropTypes.func,
    // onDrop: PropTypes.func,
    filterTreeNode: _vueTypes2['default'].func,
    openTransitionName: _vueTypes2['default'].string,
    openAnimation: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    children: _vueTypes2['default'].any
  }, {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: []
  }),

  // static childContextTypes = contextTypes;

  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var defaultExpandAll = props.defaultExpandAll,
        defaultExpandParent = props.defaultExpandParent,
        defaultExpandedKeys = props.defaultExpandedKeys,
        defaultCheckedKeys = props.defaultCheckedKeys,
        defaultSelectedKeys = props.defaultSelectedKeys,
        expandedKeys = props.expandedKeys;

    var children = this.$slots['default'];
    // Sync state with props

    var _ref = (0, _util.calcCheckedKeys)(defaultCheckedKeys, props, children) || {},
        _ref$checkedKeys = _ref.checkedKeys,
        checkedKeys = _ref$checkedKeys === undefined ? [] : _ref$checkedKeys,
        _ref$halfCheckedKeys = _ref.halfCheckedKeys,
        halfCheckedKeys = _ref$halfCheckedKeys === undefined ? [] : _ref$halfCheckedKeys;

    var state = {
      sSelectedKeys: (0, _util.calcSelectedKeys)(defaultSelectedKeys, props),
      sCheckedKeys: checkedKeys,
      sHalfCheckedKeys: halfCheckedKeys
    };

    if (defaultExpandAll) {
      state.sExpandedKeys = (0, _util.getFullKeyList)(children);
    } else if (defaultExpandParent) {
      state.sExpandedKeys = (0, _util.calcExpandedKeys)(expandedKeys || defaultExpandedKeys, props, children);
    } else {
      state.sExpandedKeys = defaultExpandedKeys;
    }

    // Cache for check status to optimize
    this.checkedBatch = null;
    this.propsToStateMap = {
      expandedKeys: 'sExpandedKeys',
      selectedKeys: 'sSelectedKeys',
      checkedKeys: 'sCheckedKeys',
      halfCheckedKeys: 'sHalfCheckedKeys'
    };
    return (0, _extends3['default'])({}, state, this.getSyncProps(props), {
      dragOverNodeKey: '',
      dropPosition: null,
      dragNodesKeys: []
    });
  },
  provide: function provide() {
    return {
      vcTree: this
    };
  },


  watch: {
    children: function children(val) {
      var _ref2 = (0, _util.calcCheckedKeys)(this.checkedKeys || this.sCheckedKeys, this.$props, val) || {},
          _ref2$checkedKeys = _ref2.checkedKeys,
          checkedKeys = _ref2$checkedKeys === undefined ? [] : _ref2$checkedKeys,
          _ref2$halfCheckedKeys = _ref2.halfCheckedKeys,
          halfCheckedKeys = _ref2$halfCheckedKeys === undefined ? [] : _ref2$halfCheckedKeys;

      this.sCheckedKeys = checkedKeys;
      this.sHalfCheckedKeys = halfCheckedKeys;
    },
    autoExpandParent: function autoExpandParent(val) {
      this.sExpandedKeys = val ? (0, _util.calcExpandedKeys)(this.expandedKeys, this.$props, this.$slots['default']) : this.expandedKeys;
    },
    expandedKeys: function expandedKeys(val) {
      this.sExpandedKeys = this.autoExpandParent ? (0, _util.calcExpandedKeys)(val, this.$props, this.$slots['default']) : val;
    },
    selectedKeys: function selectedKeys(val) {
      this.sSelectedKeys = (0, _util.calcSelectedKeys)(val, this.$props, this.$slots['default']);
    },
    checkedKeys: function checkedKeys(val) {
      var _ref3 = (0, _util.calcCheckedKeys)(val, this.$props, this.$slots['default']) || {},
          _ref3$checkedKeys = _ref3.checkedKeys,
          checkedKeys = _ref3$checkedKeys === undefined ? [] : _ref3$checkedKeys,
          _ref3$halfCheckedKeys = _ref3.halfCheckedKeys,
          halfCheckedKeys = _ref3$halfCheckedKeys === undefined ? [] : _ref3$halfCheckedKeys;

      this.sCheckedKeys = checkedKeys;
      this.sHalfCheckedKeys = halfCheckedKeys;
    }
  },

  // componentWillReceiveProps (nextProps) {
  //   // React 16 will not trigger update if new state is null
  //   this.setState(this.getSyncProps(nextProps, this.props))
  // },

  methods: {
    onNodeDragStart: function onNodeDragStart(event, node) {
      var sExpandedKeys = this.sExpandedKeys;
      var eventKey = node.eventKey;

      var children = (0, _propsUtil.getSlots)(node)['default'];
      this.dragNode = node;

      this.setState({
        dragNodesKeys: (0, _util.getDragNodesKeys)(children, node),
        sExpandedKeys: (0, _util.arrDel)(sExpandedKeys, eventKey)
      });
      this.__emit('dragstart', { event: event, node: node });
    },


    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    onNodeDragEnter: function onNodeDragEnter(event, node) {
      var _this = this;

      var sExpandedKeys = this.sExpandedKeys;
      var pos = node.pos,
          eventKey = node.eventKey;


      var dropPosition = (0, _util.calcDropPosition)(event, node);

      // Skip if drag node is self
      if (this.dragNode.eventKey === eventKey && dropPosition === 0) {
        this.setState({
          dragOverNodeKey: '',
          dropPosition: null
        });
        return;
      }

      // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
      setTimeout(function () {
        // Update drag over node
        _this.setState({
          dragOverNodeKey: eventKey,
          dropPosition: dropPosition
        });

        // Side effect for delay drag
        if (!_this.delayedDragEnterLogic) {
          _this.delayedDragEnterLogic = {};
        }
        Object.keys(_this.delayedDragEnterLogic).forEach(function (key) {
          clearTimeout(_this.delayedDragEnterLogic[key]);
        });
        _this.delayedDragEnterLogic[pos] = setTimeout(function () {
          var newExpandedKeys = (0, _util.arrAdd)(sExpandedKeys, eventKey);
          _this.setState({
            sExpandedKeys: newExpandedKeys
          });
          _this.__emit('dragenter', { event: event, node: node, expandedKeys: newExpandedKeys });
        }, 400);
      }, 0);
    },
    onNodeDragOver: function onNodeDragOver(event, node) {
      var eventKey = node.eventKey;

      // Update drag position

      if (this.dragNode && eventKey === this.dragOverNodeKey) {
        var dropPosition = (0, _util.calcDropPosition)(event, node);

        if (dropPosition === this.dropPosition) return;

        this.setState({
          dropPosition: dropPosition
        });
      }
      this.__emit('dragover', { event: event, node: node });
    },
    onNodeDragLeave: function onNodeDragLeave(event, node) {
      this.setState({
        dragOverNodeKey: ''
      });
      this.__emit('dragleave', { event: event, node: node });
    },
    onNodeDragEnd: function onNodeDragEnd(event, node) {
      this.setState({
        dragOverNodeKey: ''
      });
      this.__emit('dragend', { event: event, node: node });
    },
    onNodeDrop: function onNodeDrop(event, node) {
      var dragNodesKeys = this.dragNodesKeys,
          dropPosition = this.dropPosition;
      var eventKey = node.eventKey,
          pos = node.pos;


      this.setState({
        dragOverNodeKey: '',
        dropNodeKey: eventKey
      });

      if (dragNodesKeys.indexOf(eventKey) !== -1) {
        (0, _warning2['default'])(false, 'Can not drop to dragNode(include it\'s children node)');
        return;
      }

      var posArr = (0, _util.posToArr)(pos);

      var dropResult = {
        event: event,
        node: node,
        dragNode: this.dragNode,
        dragNodesKeys: dragNodesKeys.slice(),
        dropPosition: dropPosition + Number(posArr[posArr.length - 1])
      };

      if (dropPosition !== 0) {
        dropResult.dropToGap = true;
      }
      this.__emit('drop', dropResult);
    },
    onNodeSelect: function onNodeSelect(e, treeNode) {
      var sSelectedKeys = this.sSelectedKeys,
          multiple = this.multiple,
          children = this.$slots['default'];

      var _getOptionProps = (0, _propsUtil.getOptionProps)(treeNode),
          selected = _getOptionProps.selected,
          eventKey = _getOptionProps.eventKey;

      var targetSelected = !selected;
      var selectedKeys = sSelectedKeys;
      // Update selected keys
      if (!targetSelected) {
        selectedKeys = (0, _util.arrDel)(selectedKeys, eventKey);
      } else if (!multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys = (0, _util.arrAdd)(selectedKeys, eventKey);
      }

      // [Legacy] Not found related usage in doc or upper libs
      // [Legacy] TODO: add optimize prop to skip node process
      var selectedNodes = [];
      if (selectedKeys.length) {
        (0, _util.traverseTreeNodes)(children, function (_ref4) {
          var node = _ref4.node,
              key = _ref4.key;

          if (selectedKeys.indexOf(key) !== -1) {
            selectedNodes.push(node);
          }
        });
      }

      this.setUncontrolledState({ selectedKeys: selectedKeys });

      var eventObj = {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes: selectedNodes
      };
      this.__emit('select', selectedKeys, eventObj);
    },


    /**
     * This will cache node check status to optimize update process.
     * When Tree get trigger `onCheckConductFinished` will flush all the update.
     */
    onBatchNodeCheck: function onBatchNodeCheck(key, checked, halfChecked, startNode) {
      if (startNode) {
        this.checkedBatch = {
          treeNode: startNode,
          checked: checked,
          list: []
        };
      }

      // This code should never called
      if (!this.checkedBatch) {
        this.checkedBatch = {
          list: []
        };
        (0, _warning2['default'])(false, 'Checked batch not init. This should be a bug. Please fire a issue.');
      }

      this.checkedBatch.list.push({ key: key, checked: checked, halfChecked: halfChecked });
    },


    /**
     * When top `onCheckConductFinished` called, will execute all batch update.
     * And trigger `onCheck` event.
     */
    onCheckConductFinished: function onCheckConductFinished() {
      var sCheckedKeys = this.sCheckedKeys,
          sHalfCheckedKeys = this.sHalfCheckedKeys,
          checkStrictly = this.checkStrictly,
          children = this.$slots['default'];

      // Use map to optimize update speed

      var checkedKeySet = {};
      var halfCheckedKeySet = {};

      sCheckedKeys.forEach(function (key) {
        checkedKeySet[key] = true;
      });
      sHalfCheckedKeys.forEach(function (key) {
        halfCheckedKeySet[key] = true;
      });

      // Batch process
      this.checkedBatch.list.forEach(function (_ref5) {
        var key = _ref5.key,
            checked = _ref5.checked,
            halfChecked = _ref5.halfChecked;

        checkedKeySet[key] = checked;
        halfCheckedKeySet[key] = halfChecked;
      });
      var newCheckedKeys = Object.keys(checkedKeySet).filter(function (key) {
        return checkedKeySet[key];
      });
      var newHalfCheckedKeys = Object.keys(halfCheckedKeySet).filter(function (key) {
        return halfCheckedKeySet[key];
      });

      // Trigger onChecked
      var selectedObj = void 0;

      var eventObj = {
        event: 'check',
        node: this.checkedBatch.treeNode,
        checked: this.checkedBatch.checked
      };

      if (checkStrictly) {
        selectedObj = (0, _util.getStrictlyValue)(newCheckedKeys, newHalfCheckedKeys);

        // [Legacy] TODO: add optimize prop to skip node process
        eventObj.checkedNodes = [];
        (0, _util.traverseTreeNodes)(children, function (_ref6) {
          var node = _ref6.node,
              key = _ref6.key;

          if (checkedKeySet[key]) {
            eventObj.checkedNodes.push(node);
          }
        });

        this.setUncontrolledState({ checkedKeys: newCheckedKeys });
      } else {
        selectedObj = newCheckedKeys;

        // [Legacy] TODO: add optimize prop to skip node process
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = []; // [Legacy] TODO: not in API
        eventObj.halfCheckedKeys = newHalfCheckedKeys; // [Legacy] TODO: not in API
        (0, _util.traverseTreeNodes)(children, function (_ref7) {
          var node = _ref7.node,
              pos = _ref7.pos,
              key = _ref7.key;

          if (checkedKeySet[key]) {
            eventObj.checkedNodes.push(node);
            eventObj.checkedNodesPositions.push({ node: node, pos: pos });
          }
        });

        this.setUncontrolledState({
          checkedKeys: newCheckedKeys,
          halfCheckedKeys: newHalfCheckedKeys
        });
      }
      this.__emit('check', selectedObj, eventObj);

      // Clean up
      this.checkedBatch = null;
    },
    onNodeExpand: function onNodeExpand(e, treeNode) {
      var _this2 = this;

      var sExpandedKeys = this.sExpandedKeys,
          loadData = this.loadData;

      var expandedKeys = [].concat((0, _toConsumableArray3['default'])(sExpandedKeys));

      var _getOptionProps2 = (0, _propsUtil.getOptionProps)(treeNode),
          eventKey = _getOptionProps2.eventKey,
          expanded = _getOptionProps2.expanded;

      // Update selected keys


      var index = expandedKeys.indexOf(eventKey);
      var targetExpanded = !expanded;

      (0, _warning2['default'])(expanded && index !== -1 || !expanded && index === -1, 'Expand state not sync with index check');

      if (targetExpanded) {
        expandedKeys = (0, _util.arrAdd)(expandedKeys, eventKey);
      } else {
        expandedKeys = (0, _util.arrDel)(expandedKeys, eventKey);
      }

      this.setUncontrolledState({ expandedKeys: expandedKeys });
      this.__emit('expand', expandedKeys, { node: treeNode, expanded: targetExpanded });

      // Async Load data
      if (targetExpanded && loadData) {
        return loadData(treeNode).then(function () {
          // [Legacy] Refresh logic
          _this2.setUncontrolledState({ expandedKeys: expandedKeys });
        });
      }

      return null;
    },
    onNodeMouseEnter: function onNodeMouseEnter(event, node) {
      this.__emit('mouseenter', { event: event, node: node });
    },
    onNodeMouseLeave: function onNodeMouseLeave(event, node) {
      this.__emit('mouseleave', { event: event, node: node });
    },
    onNodeContextMenu: function onNodeContextMenu(event, node) {
      event.preventDefault();
      this.__emit('rightClick', { event: event, node: node });
    },


    /**
     * Sync state with props if needed
     */
    getSyncProps: function getSyncProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var newState = {};
      var children = this.$slots['default'];
      if (props.selectedKeys !== undefined) {
        newState.sSelectedKeys = (0, _util.calcSelectedKeys)(props.selectedKeys, props, children);
      }

      if (props.checkedKeys !== undefined) {
        var _ref8 = (0, _util.calcCheckedKeys)(props.checkedKeys, props, children) || {},
            _ref8$checkedKeys = _ref8.checkedKeys,
            checkedKeys = _ref8$checkedKeys === undefined ? [] : _ref8$checkedKeys,
            _ref8$halfCheckedKeys = _ref8.halfCheckedKeys,
            halfCheckedKeys = _ref8$halfCheckedKeys === undefined ? [] : _ref8$halfCheckedKeys;

        newState.sCheckedKeys = checkedKeys;
        newState.sHalfCheckedKeys = halfCheckedKeys;
      }

      return newState;
    },


    /**
     * Only update the value which is not in props
     */
    setUncontrolledState: function setUncontrolledState(state) {
      var _this3 = this;

      var needSync = false;
      var newState = {};
      var props = (0, _propsUtil.getOptionProps)(this);
      Object.keys(state).forEach(function (name) {
        if (name in props) return;

        needSync = true;
        var key = _this3.propsToStateMap[name];
        newState[key] = state[name];
      });

      this.setState(needSync ? newState : null);
    },
    isKeyChecked: function isKeyChecked(key) {
      var _sCheckedKeys = this.sCheckedKeys,
          sCheckedKeys = _sCheckedKeys === undefined ? [] : _sCheckedKeys;

      return sCheckedKeys.indexOf(key) !== -1;
    },


    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */
    renderTreeNode: function renderTreeNode(child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var _sExpandedKeys = this.sExpandedKeys,
          sExpandedKeys = _sExpandedKeys === undefined ? [] : _sExpandedKeys,
          _sSelectedKeys = this.sSelectedKeys,
          sSelectedKeys = _sSelectedKeys === undefined ? [] : _sSelectedKeys,
          _sHalfCheckedKeys = this.sHalfCheckedKeys,
          sHalfCheckedKeys = _sHalfCheckedKeys === undefined ? [] : _sHalfCheckedKeys,
          dragOverNodeKey = this.dragOverNodeKey,
          dropPosition = this.dropPosition;

      var pos = (0, _util.getPosition)(level, index);
      var key = child.key || pos;

      return (0, _vnode.cloneElement)(child, {
        props: {
          eventKey: key,
          expanded: sExpandedKeys.indexOf(key) !== -1,
          selected: sSelectedKeys.indexOf(key) !== -1,
          checked: this.isKeyChecked(key),
          halfChecked: sHalfCheckedKeys.indexOf(key) !== -1,
          pos: pos,

          // [Legacy] Drag props
          dragOver: dragOverNodeKey === key && dropPosition === 0,
          dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
          dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1
        }

      });
    }
  },

  render: function render() {
    var _this4 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        focusable = this.focusable,
        showLine = this.showLine,
        _$slots$default = this.$slots['default'],
        children = _$slots$default === undefined ? [] : _$slots$default;

    var domProps = {};

    return h(
      'ul',
      (0, _babelHelperVueJsxMergeProps2['default'])([domProps, {
        'class': (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-show-line', showLine)),
        attrs: { role: 'tree-node',
          unselectable: 'on',
          tabIndex: focusable ? '0' : null
        },
        on: {
          'keydown': focusable ? this.onKeydown : function () {}
        }
      }]),
      [children.map(function (child, index) {
        return _this4.renderTreeNode(child, index);
      })]
    );
  }
};

exports['default'] = Tree;
module.exports = exports['default'];