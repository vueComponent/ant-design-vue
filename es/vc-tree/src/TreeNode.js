import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import warning from 'warning';
import { getPosition, getNodeChildren as _getNodeChildren, isCheckDisabled, traverseTreeNodes } from './util';
import { initDefaultProps, getOptionProps, filterEmpty, getComponentFromProp } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import getTransitionProps from '../../_util/getTransitionProps';

var ICON_OPEN = 'open';
var ICON_CLOSE = 'close';

var LOAD_STATUS_NONE = 0;
var LOAD_STATUS_LOADING = 1;
var LOAD_STATUS_LOADED = 2;
var LOAD_STATUS_FAILED = 0; // Action align, let's make failed same as init.

var defaultTitle = '---';

var onlyTreeNodeWarned = false; // Only accept TreeNode

var TreeNode = {
  name: 'TreeNode',
  mixins: [BaseMixin],
  __ANT_TREE_NODE: true,
  props: initDefaultProps({
    eventKey: PropTypes.string, // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    // className: PropTypes.string,
    root: PropTypes.object,
    // onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    halfChecked: PropTypes.bool,
    title: PropTypes.any,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    icon: PropTypes.any,
    dataRef: PropTypes.object
  }, {}),

  data: function data() {
    return {
      loadStatus: LOAD_STATUS_NONE,
      dragNodeHighlight: false
    };
  },

  inject: {
    vcTree: { 'default': {} },
    vcTreeNode: { 'default': {} }
  },
  provide: function provide() {
    return {
      vcTreeNode: this
    };
  },


  // Isomorphic needn't load data in server side
  mounted: function mounted() {
    this.syncLoadData(this.$props);
  },

  watch: {
    expanded: function expanded(val) {
      this.syncLoadData({ expanded: val });
    }
  },

  methods: {
    onUpCheckConduct: function onUpCheckConduct(treeNode, nodeChecked, nodeHalfChecked) {
      var _getOptionProps = getOptionProps(treeNode),
          nodePos = _getOptionProps.pos;

      var eventKey = this.eventKey,
          pos = this.pos,
          checked = this.checked,
          halfChecked = this.halfChecked;
      var _vcTree = this.vcTree,
          checkStrictly = _vcTree.checkStrictly,
          isKeyChecked = _vcTree.isKeyChecked,
          onBatchNodeCheck = _vcTree.onBatchNodeCheck,
          onCheckConductFinished = _vcTree.onCheckConductFinished,
          _vcTreeNode = this.vcTreeNode;
      _vcTreeNode = _vcTreeNode === undefined ? {} : _vcTreeNode;
      var onUpCheckConduct = _vcTreeNode.onUpCheckConduct;

      // Stop conduct when current node is disabled

      if (isCheckDisabled(this)) {
        onCheckConductFinished();
        return;
      }

      var children = this.getNodeChildren();

      var checkedCount = nodeChecked ? 1 : 0;

      // Statistic checked count
      children.forEach(function (node, index) {
        var childPos = getPosition(pos, index);

        if (nodePos === childPos || isCheckDisabled(node)) {
          return;
        }
        if (isKeyChecked(node.key || childPos)) {
          checkedCount += 1;
        }
      });

      // Static enabled children count
      var enabledChildrenCount = children.filter(function (node) {
        return !isCheckDisabled(node);
      }).length;

      // checkStrictly will not conduct check status
      var nextChecked = checkStrictly ? checked : enabledChildrenCount === checkedCount;
      var nextHalfChecked = checkStrictly // propagated or child checked
      ? halfChecked : nodeHalfChecked || checkedCount > 0 && !nextChecked;

      // Add into batch update
      if (checked !== nextChecked || halfChecked !== nextHalfChecked) {
        onBatchNodeCheck(eventKey, nextChecked, nextHalfChecked);

        if (onUpCheckConduct) {
          onUpCheckConduct(this, nextChecked, nextHalfChecked);
        } else {
          // Flush all the update
          onCheckConductFinished();
        }
      } else {
        // Flush all the update
        onCheckConductFinished();
      }
    },
    onDownCheckConduct: function onDownCheckConduct(nodeChecked) {
      var $slots = this.$slots;

      var children = $slots['default'] || [];
      var _vcTree2 = this.vcTree,
          checkStrictly = _vcTree2.checkStrictly,
          isKeyChecked = _vcTree2.isKeyChecked,
          onBatchNodeCheck = _vcTree2.onBatchNodeCheck;

      if (checkStrictly) return;

      traverseTreeNodes(children, function (_ref) {
        var node = _ref.node,
            key = _ref.key;

        if (isCheckDisabled(node)) return false;

        if (nodeChecked !== isKeyChecked(key)) {
          onBatchNodeCheck(key, nodeChecked, false);
        }
      });
    },
    onSelectorClick: function onSelectorClick(e) {
      if (this.isSelectable()) {
        this.onSelect(e);
      } else {
        this.onCheck(e);
      }
    },
    onSelect: function onSelect(e) {
      if (this.isDisabled()) return;

      var onNodeSelect = this.vcTree.onNodeSelect;

      e.preventDefault();
      onNodeSelect(e, this);
    },
    onCheck: function onCheck(e) {
      if (this.isDisabled()) return;

      var disableCheckbox = this.disableCheckbox,
          checked = this.checked,
          eventKey = this.eventKey;
      var _vcTree3 = this.vcTree,
          checkable = _vcTree3.checkable,
          onBatchNodeCheck = _vcTree3.onBatchNodeCheck,
          onCheckConductFinished = _vcTree3.onCheckConductFinished,
          _vcTreeNode2 = this.vcTreeNode;
      _vcTreeNode2 = _vcTreeNode2 === undefined ? {} : _vcTreeNode2;
      var onUpCheckConduct = _vcTreeNode2.onUpCheckConduct;


      if (!checkable || disableCheckbox) return;

      e.preventDefault();
      var targetChecked = !checked;
      onBatchNodeCheck(eventKey, targetChecked, false, this);

      // Children conduct
      this.onDownCheckConduct(targetChecked);

      // Parent conduct
      if (onUpCheckConduct) {
        onUpCheckConduct(this, targetChecked, false);
      } else {
        onCheckConductFinished();
      }
    },
    onMouseEnter: function onMouseEnter(e) {
      var onNodeMouseEnter = this.vcTree.onNodeMouseEnter;

      onNodeMouseEnter(e, this);
    },
    onMouseLeave: function onMouseLeave(e) {
      var onNodeMouseLeave = this.vcTree.onNodeMouseLeave;

      onNodeMouseLeave(e, this);
    },
    onContextMenu: function onContextMenu(e) {
      var onNodeContextMenu = this.vcTree.onNodeContextMenu;

      onNodeContextMenu(e, this);
    },
    onDragStart: function onDragStart(e) {
      var onNodeDragStart = this.vcTree.onNodeDragStart;


      e.stopPropagation();
      this.setState({
        dragNodeHighlight: true
      });
      onNodeDragStart(e, this);

      try {
        // ie throw error
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
        // empty
      }
    },
    onDragEnter: function onDragEnter(e) {
      var onNodeDragEnter = this.vcTree.onNodeDragEnter;


      e.preventDefault();
      e.stopPropagation();
      onNodeDragEnter(e, this);
    },
    onDragOver: function onDragOver(e) {
      var onNodeDragOver = this.vcTree.onNodeDragOver;


      e.preventDefault();
      e.stopPropagation();
      onNodeDragOver(e, this);
    },
    onDragLeave: function onDragLeave(e) {
      var onNodeDragLeave = this.vcTree.onNodeDragLeave;


      e.stopPropagation();
      onNodeDragLeave(e, this);
    },
    onDragEnd: function onDragEnd(e) {
      var onNodeDragEnd = this.vcTree.onNodeDragEnd;


      e.stopPropagation();
      this.setState({
        dragNodeHighlight: false
      });
      onNodeDragEnd(e, this);
    },
    onDrop: function onDrop(e) {
      var onNodeDrop = this.vcTree.onNodeDrop;


      e.preventDefault();
      e.stopPropagation();
      this.setState({
        dragNodeHighlight: false
      });
      onNodeDrop(e, this);
    },


    // Disabled item still can be switch
    onExpand: function onExpand(e) {
      var _this = this;

      var onNodeExpand = this.vcTree.onNodeExpand;

      var callbackPromise = onNodeExpand(e, this);

      // Promise like
      if (callbackPromise && callbackPromise.then) {
        this.setState({ loadStatus: LOAD_STATUS_LOADING });

        callbackPromise.then(function () {
          _this.setState({ loadStatus: LOAD_STATUS_LOADED });
        })['catch'](function () {
          _this.setState({ loadStatus: LOAD_STATUS_FAILED });
        });
      }
    },
    getNodeChildren: function getNodeChildren() {
      var children = this.$slots['default'];

      var originList = filterEmpty(children);
      var targetList = _getNodeChildren(originList);

      if (originList.length !== targetList.length && !onlyTreeNodeWarned) {
        onlyTreeNodeWarned = true;
        warning(false, 'Tree only accept TreeNode as children.');
      }

      return targetList;
    },
    getNodeState: function getNodeState() {
      var expanded = this.expanded;


      if (this.isLeaf2()) {
        return null;
      }

      return expanded ? ICON_OPEN : ICON_CLOSE;
    },
    isLeaf2: function isLeaf2() {
      var isLeaf = this.isLeaf,
          loadStatus = this.loadStatus;
      var loadData = this.vcTree.loadData;


      var hasChildren = this.getNodeChildren().length !== 0;

      return isLeaf || !loadData && !hasChildren || loadData && loadStatus === LOAD_STATUS_LOADED && !hasChildren;
    },
    isDisabled: function isDisabled() {
      var disabled = this.disabled;
      var treeDisabled = this.vcTree.disabled;

      // Follow the logic of Selectable

      if (disabled === false) {
        return false;
      }

      return !!(treeDisabled || disabled);
    },
    isSelectable: function isSelectable() {
      var selectable = this.selectable;
      var treeSelectable = this.vcTree.selectable;

      // Ignore when selectable is undefined or null

      if (typeof selectable === 'boolean') {
        return selectable;
      }

      return treeSelectable;
    },


    // Load data to avoid default expanded tree without data
    syncLoadData: function syncLoadData(props) {
      var _this2 = this;

      var expanded = this.expanded;
      var loadData = this.vcTree.loadData;

      // read from state to avoid loadData at same time

      this.setState(function (_ref2) {
        var loadStatus = _ref2.loadStatus;

        if (loadData && loadStatus === LOAD_STATUS_NONE && expanded && !_this2.isLeaf2()) {
          loadData(_this2).then(function () {
            _this2.setState({ loadStatus: LOAD_STATUS_LOADED });
          })['catch'](function () {
            _this2.setState({ loadStatus: LOAD_STATUS_FAILED });
          });

          return { loadStatus: LOAD_STATUS_LOADING };
        }

        return null;
      });

      // const { loadStatus } = this
      // const { expanded } = props
      // const { vcTree: { loadData }} = this

      // if (loadData && loadStatus === LOAD_STATUS_NONE && expanded && !this.isLeaf2()) {
      //   this.setState({ loadStatus: LOAD_STATUS_LOADING })

      //   loadData(this).then(() => {
      //     this.setState({ loadStatus: LOAD_STATUS_LOADED })
      //   }).catch(() => {
      //     this.setState({ loadStatus: LOAD_STATUS_FAILED })
      //   })
      // }
    },


    // Switcher
    renderSwitcher: function renderSwitcher() {
      var h = this.$createElement;
      var expanded = this.expanded;
      var prefixCls = this.vcTree.prefixCls;


      if (this.isLeaf2()) {
        return h('span', { 'class': prefixCls + '-switcher ' + prefixCls + '-switcher-noop' });
      }

      return h('span', {
        'class': classNames(prefixCls + '-switcher', prefixCls + '-switcher_' + (expanded ? ICON_OPEN : ICON_CLOSE)),
        on: {
          'click': this.onExpand
        }
      });
    },


    // Checkbox
    renderCheckbox: function renderCheckbox() {
      var h = this.$createElement;
      var checked = this.checked,
          halfChecked = this.halfChecked,
          disableCheckbox = this.disableCheckbox;
      var _vcTree4 = this.vcTree,
          prefixCls = _vcTree4.prefixCls,
          checkable = _vcTree4.checkable;

      var disabled = this.isDisabled();

      if (!checkable) return null;

      // [Legacy] Custom element should be separate with `checkable` in future
      var $custom = typeof checkable !== 'boolean' ? checkable : null;

      return h(
        'span',
        {
          'class': classNames(prefixCls + '-checkbox', checked && prefixCls + '-checkbox-checked', !checked && halfChecked && prefixCls + '-checkbox-indeterminate', (disabled || disableCheckbox) && prefixCls + '-checkbox-disabled'),
          on: {
            'click': this.onCheck
          }
        },
        [$custom]
      );
    },
    renderIcon: function renderIcon() {
      var h = this.$createElement;
      var loadStatus = this.loadStatus;
      var prefixCls = this.vcTree.prefixCls;


      return h('span', {
        'class': classNames(prefixCls + '-iconEle', prefixCls + '-icon__' + (this.getNodeState() || 'docu'), loadStatus === LOAD_STATUS_LOADING && prefixCls + '-icon_loading')
      });
    },


    // Icon + Title
    renderSelector: function renderSelector() {
      var h = this.$createElement;
      var selected = this.selected,
          icon = this.icon,
          loadStatus = this.loadStatus,
          dragNodeHighlight = this.dragNodeHighlight,
          $scopedSlots = this.$scopedSlots;
      var _vcTree5 = this.vcTree,
          prefixCls = _vcTree5.prefixCls,
          showIcon = _vcTree5.showIcon,
          draggable = _vcTree5.draggable,
          loadData = _vcTree5.loadData;

      var disabled = this.isDisabled();
      var title = getComponentFromProp(this, 'title') || defaultTitle;
      var treeIcon = getComponentFromProp(this, 'icon') || $scopedSlots.icon;
      var wrapClass = prefixCls + '-node-content-wrapper';

      // Icon - Still show loading icon when loading without showIcon
      var $icon = void 0;

      if (showIcon) {
        var currentIcon = icon || treeIcon;
        $icon = currentIcon ? h(
          'span',
          {
            'class': classNames(prefixCls + '-iconEle', prefixCls + '-icon__customize')
          },
          [typeof currentIcon === 'function' ? currentIcon(this.$props) : currentIcon]
        ) : this.renderIcon();
      } else if (loadData && loadStatus === LOAD_STATUS_LOADING) {
        $icon = this.renderIcon();
      }

      // Title
      var $title = h(
        'span',
        { 'class': prefixCls + '-title' },
        [title]
      );

      return h(
        'span',
        {
          ref: 'selectHandle',
          attrs: { title: typeof title === 'string' ? title : '',

            draggable: !disabled && draggable || undefined,
            'aria-grabbed': !disabled && draggable || undefined
          },
          'class': classNames('' + wrapClass, wrapClass + '-' + (this.getNodeState() || 'normal'), !disabled && (selected || dragNodeHighlight) && prefixCls + '-node-selected', !disabled && draggable && 'draggable'), on: {
            'mouseenter': this.onMouseEnter,
            'mouseleave': this.onMouseLeave,
            'contextmenu': this.onContextMenu,
            'click': this.onSelectorClick,
            'dragstart': this.onDragStart
          }
        },
        [$icon, $title]
      );
    },


    // Children list wrapped with `Animation`
    renderChildren: function renderChildren() {
      var h = this.$createElement;
      var expanded = this.expanded,
          pos = this.pos;
      var _vcTree6 = this.vcTree,
          prefixCls = _vcTree6.prefixCls,
          openTransitionName = _vcTree6.openTransitionName,
          openAnimation = _vcTree6.openAnimation,
          renderTreeNode = _vcTree6.renderTreeNode;

      // [Legacy] Animation control

      var renderFirst = this.renderFirst;
      this.renderFirst = 1;
      var transitionAppear = true;
      if (!renderFirst && expanded) {
        transitionAppear = false;
      }

      var animProps = {};
      if (openTransitionName) {
        animProps = getTransitionProps(openTransitionName, { appear: transitionAppear });
      } else if ((typeof openAnimation === 'undefined' ? 'undefined' : _typeof(openAnimation)) === 'object') {
        animProps = _extends({}, openAnimation);
        animProps.props = _extends({ css: false }, animProps.props);
        if (!transitionAppear) {
          delete animProps.props.appear;
        }
      }

      // Children TreeNode
      var nodeList = this.getNodeChildren();

      if (nodeList.length === 0) {
        return null;
      }

      var $children = void 0;
      if (expanded) {
        $children = h(
          'ul',
          {
            'class': classNames(prefixCls + '-child-tree', expanded && prefixCls + '-child-tree-open'),
            attrs: { 'data-expanded': expanded
            }
          },
          [nodeList.map(function (node, index) {
            return renderTreeNode(node, index, pos);
          })]
        );
      }

      return h(
        'transition',
        animProps,
        [$children]
      );
    }
  },

  render: function render() {
    var _ref3;

    var h = arguments[0];
    var dragOver = this.dragOver,
        dragOverGapTop = this.dragOverGapTop,
        dragOverGapBottom = this.dragOverGapBottom;
    var _vcTree7 = this.vcTree,
        prefixCls = _vcTree7.prefixCls,
        filterTreeNode = _vcTree7.filterTreeNode;

    var disabled = this.isDisabled();

    return h(
      'li',
      {
        'class': (_ref3 = {}, _defineProperty(_ref3, prefixCls + '-treenode-disabled', disabled), _defineProperty(_ref3, 'drag-over', !disabled && dragOver), _defineProperty(_ref3, 'drag-over-gap-top', !disabled && dragOverGapTop), _defineProperty(_ref3, 'drag-over-gap-bottom', !disabled && dragOverGapBottom), _defineProperty(_ref3, 'filter-node', filterTreeNode && filterTreeNode(this)), _ref3),
        on: {
          'dragenter': this.onDragEnter,
          'dragover': this.onDragOver,
          'dragleave': this.onDragLeave,
          'drop': this.onDrop,
          'dragend': this.onDragEnd
        }
      },
      [this.renderSwitcher(), this.renderCheckbox(), this.renderSelector(), this.renderChildren()]
    );
  }
};

TreeNode.isTreeNode = 1;

export default TreeNode;