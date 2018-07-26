'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeNode = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _propsUtil = require('../../_util/props-util');

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Tree2['default'].TreeNode = _TreeNode2['default'];

//
var NewTree = {
  TreeNode: _TreeNode2['default'],
  props: _Tree2['default'].props,
  render: function render() {
    var h = arguments[0];
    var $listeners = this.$listeners,
        $slots = this.$slots;

    var treeProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        children: $slots['default']
      }),
      on: $listeners
    };
    return h(
      _Tree2['default'],
      treeProps,
      [$slots['default']]
    );
  }
};
exports.TreeNode = _TreeNode2['default'];
exports['default'] = NewTree;