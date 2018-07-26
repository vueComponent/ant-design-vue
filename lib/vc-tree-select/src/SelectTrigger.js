'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _trigger = require('../../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _vcTree = require('../../vc-tree');

var _vcTree2 = _interopRequireDefault(_vcTree);

var _PropTypes = require('./PropTypes');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('./util');

var _vnode = require('../../_util/vnode');

var _propsUtil = require('../../_util/props-util');

var _utils = require('../../_util/vue-types/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

var SelectTrigger = {
  mixins: [_BaseMixin2['default']],
  name: 'SelectTrigger',
  props: (0, _extends3['default'])({}, _PropTypes.SelectPropTypes, {
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    dropdownPopupAlign: _vueTypes2['default'].object,
    visible: _vueTypes2['default'].bool,
    filterTreeNode: _vueTypes2['default'].any,
    treeNodes: _vueTypes2['default'].any,
    inputValue: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    popupClassName: _vueTypes2['default'].string,
    _cachetreeData: _vueTypes2['default'].any,
    _treeNodesStates: _vueTypes2['default'].any,
    halfCheckedValues: _vueTypes2['default'].any,
    inputElement: _vueTypes2['default'].any
  }),
  data: function data() {
    return {
      sExpandedKeys: [],
      fireOnExpand: false,
      dropdownWidth: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setDropdownWidth();
    });
  },

  watch: {
    inputValue: function inputValue(val) {
      // set autoExpandParent to true
      this.setState({
        sExpandedKeys: [],
        fireOnExpand: false
      });
    }
  },

  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setDropdownWidth();
    });
  },

  methods: {
    onExpand: function onExpand(expandedKeys) {
      var _this3 = this;

      // rerender
      this.setState({
        sExpandedKeys: expandedKeys,
        fireOnExpand: true
      }, function () {
        // Fix https://github.com/ant-design/ant-design/issues/5689
        if (_this3.$refs.trigger && _this3.$refs.trigger.forcePopupAlign) {
          _this3.$refs.trigger.forcePopupAlign();
        }
      });
    },
    setDropdownWidth: function setDropdownWidth() {
      var width = this.$el.offsetWidth;
      if (width !== this.dropdownWidth) {
        this.setState({ dropdownWidth: width });
      }
    },
    getPopupEleRefs: function getPopupEleRefs() {
      return this.$refs.popupEle;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    getDropdownTransitionName: function getDropdownTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = this.getDropdownPrefixCls() + '-' + props.animation;
      }
      return transitionName;
    },
    getDropdownPrefixCls: function getDropdownPrefixCls() {
      return this.prefixCls + '-dropdown';
    },
    highlightTreeNode: function highlightTreeNode(treeNode) {
      var props = this.$props;
      var filterVal = treeNode.$props[(0, _util.labelCompatible)(props.treeNodeFilterProp)];
      if (typeof filterVal === 'string') {
        return props.inputValue && filterVal.indexOf(props.inputValue) > -1;
      }
      return false;
    },
    filterTreeNode_: function filterTreeNode_(input, child) {
      if (!input) {
        return true;
      }
      var filterTreeNode = this.filterTreeNode;
      if (!filterTreeNode) {
        return true;
      }
      var props = (0, _propsUtil.getAllProps)(child);
      if (props && props.disabled) {
        return false;
      }
      return filterTreeNode.call(this, input, child);
    },
    processTreeNode: function processTreeNode(treeNodes) {
      var _this4 = this;

      var filterPoss = [];
      this._expandedKeys = [];
      (0, _util.loopAllChildren)(treeNodes, function (child, index, pos) {
        if (_this4.filterTreeNode_(_this4.inputValue, child)) {
          filterPoss.push(pos);
          _this4._expandedKeys.push(String((0, _propsUtil.getKey)(child)));
        }
      });

      // Include the filtered nodes's ancestral nodes.
      var processedPoss = [];
      filterPoss.forEach(function (pos) {
        var arr = pos.split('-');
        arr.reduce(function (pre, cur) {
          var res = pre + '-' + cur;
          if (processedPoss.indexOf(res) < 0) {
            processedPoss.push(res);
          }
          return res;
        });
      });
      var filterNodesPositions = [];
      (0, _util.loopAllChildren)(treeNodes, function (child, index, pos) {
        if (processedPoss.indexOf(pos) > -1) {
          filterNodesPositions.push({ node: child, pos: pos });
        }
      });

      var hierarchyNodes = (0, _util.flatToHierarchy)(filterNodesPositions);

      var recursive = function recursive(children) {
        return children.map(function (child) {
          if (child.children) {
            return (0, _vnode.cloneElement)(child.node, {
              children: recursive(child.children)
            });
          }
          return child.node;
        });
      };
      return recursive(hierarchyNodes);
    },
    onSelect: function onSelect() {
      this.__emit.apply(this, ['select'].concat(Array.prototype.slice.call(arguments)));
    },
    renderTree: function renderTree(keys, halfCheckedKeys, newTreeNodes, multiple) {
      var h = this.$createElement;

      var props = this.$props;

      var trProps = {
        multiple: multiple,
        prefixCls: props.prefixCls + '-tree',
        showIcon: props.treeIcon,
        showLine: props.treeLine,
        defaultExpandAll: props.treeDefaultExpandAll,
        defaultExpandedKeys: props.treeDefaultExpandedKeys,
        filterTreeNode: this.highlightTreeNode
      };
      var trListeners = {};

      if (props.treeCheckable) {
        trProps.selectable = false;
        trProps.checkable = props.treeCheckable;
        trListeners.check = this.onSelect;
        trProps.checkStrictly = props.treeCheckStrictly;
        if (props.inputValue) {
          // enable checkStrictly when search tree.
          trProps.checkStrictly = true;
        } else {
          trProps._treeNodesStates = props._treeNodesStates;
        }
        if (trProps.treeCheckStrictly && halfCheckedKeys.length) {
          trProps.checkedKeys = { checked: keys, halfChecked: halfCheckedKeys };
        } else {
          trProps.checkedKeys = keys;
        }
      } else {
        trProps.selectedKeys = keys;
        trListeners.select = this.onSelect;
      }

      // expand keys
      if (!trProps.defaultExpandAll && !trProps.defaultExpandedKeys && !props.loadData) {
        trProps.expandedKeys = keys;
      }
      trProps.autoExpandParent = true;
      trListeners.expand = this.onExpand;
      if (this._expandedKeys && this._expandedKeys.length) {
        trProps.expandedKeys = this._expandedKeys;
      }
      if (this.fireOnExpand) {
        trProps.expandedKeys = this.sExpandedKeys;
        trProps.autoExpandParent = false;
      }

      // async loadData
      if (props.loadData) {
        trProps.loadData = props.loadData;
      }
      return h(
        _vcTree2['default'],
        (0, _babelHelperVueJsxMergeProps2['default'])([{ ref: 'popupEle' }, { props: trProps, on: trListeners }]),
        [newTreeNodes]
      );
    }
  },

  render: function render() {
    var _popupClassName;

    var h = arguments[0];

    var props = this.$props;
    var multiple = props.multiple;
    var dropdownPrefixCls = this.getDropdownPrefixCls();
    var popupClassName = (_popupClassName = {}, (0, _defineProperty3['default'])(_popupClassName, props.dropdownClassName, !!props.dropdownClassName), (0, _defineProperty3['default'])(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
    var visible = props.visible;
    var search = multiple || !props.showSearch ? null : h(
      'span',
      { 'class': dropdownPrefixCls + '-search' },
      [props.inputElement]
    );
    var recursive = function recursive(children) {
      return children.map(function handler(child) {
        // eslint-disable-line
        // if (isEmptyElement(child) || (child.data && child.data.slot)) {
        //   return null
        // }
        if (!(0, _propsUtil.getSlotOptions)(child).__ANT_TREE_SELECT_NODE) {
          return null;
        }
        var treeNodeProps = (0, _extends3['default'])({}, child.data, {
          props: (0, _extends3['default'])({}, (0, _propsUtil.getAllProps)(child), {
            title: (0, _propsUtil.getComponentFromProp)(child, 'title') || (0, _propsUtil.getComponentFromProp)(child, 'label')
          }),
          key: String(child.key)
        });
        if (child && child.componentOptions.children) {
          // null or String has no Prop
          return h(
            _vcTree.TreeNode,
            treeNodeProps,
            [recursive(child.componentOptions.children)]
          );
        }
        return h(_vcTree.TreeNode, treeNodeProps);
      });
    };
    // const s = Date.now();
    var treeNodes = void 0;
    if (props._cachetreeData && this.cacheTreeNodes) {
      treeNodes = this.cacheTreeNodes;
    } else {
      treeNodes = recursive(props.treeData || props.treeNodes);
      this.cacheTreeNodes = treeNodes;
    }
    // console.log(Date.now()-s);

    if (props.inputValue) {
      treeNodes = this.processTreeNode(treeNodes);
    }

    var keys = [];
    var halfCheckedKeys = [];
    (0, _util.loopAllChildren)(treeNodes, function (child) {
      if (props.value.some(function (item) {
        return item.value === (0, _util.getValuePropValue)(child);
      })) {
        keys.push(String((0, _propsUtil.getKey)(child)));
      }
      if (props.halfCheckedValues && props.halfCheckedValues.some(function (item) {
        return item.value === (0, _util.getValuePropValue)(child);
      })) {
        halfCheckedKeys.push(String((0, _propsUtil.getKey)(child)));
      }
    });

    var notFoundContent = void 0;
    if (!treeNodes.length) {
      if (props.notFoundContent) {
        notFoundContent = h(
          'span',
          { 'class': props.prefixCls + '-not-found' },
          [props.notFoundContent]
        );
      } else if (!search) {
        visible = false;
      }
    }
    var popupElement = h('div', [search, notFoundContent || this.renderTree(keys, halfCheckedKeys, treeNodes, multiple)]);

    var popupStyle = (0, _extends3['default'])({}, props.dropdownStyle);
    var widthProp = props.dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = this.dropdownWidth + 'px';
    }

    return h(
      _trigger2['default'],
      {
        attrs: {
          action: props.disabled ? [] : ['click'],

          popupPlacement: 'bottomLeft',
          builtinPlacements: BUILT_IN_PLACEMENTS,
          popupAlign: props.dropdownPopupAlign,
          prefixCls: dropdownPrefixCls,
          popupTransitionName: this.getDropdownTransitionName(),

          popup: popupElement,
          popupVisible: visible,
          getPopupContainer: props.getPopupContainer,
          popupClassName: (0, _classnames2['default'])(popupClassName),
          popupStyle: popupStyle
        },
        ref: 'trigger', on: {
          'popupVisibleChange': props.dropdownVisibleChange
        }
      },
      [this.$slots['default']]
    );
  }
};

exports['default'] = SelectTrigger;
module.exports = exports['default'];