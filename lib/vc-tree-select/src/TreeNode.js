'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcTree = require('../../vc-tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'TreeNode',
  __ANT_TREE_SELECT_NODE: true,
  props: (0, _extends3['default'])({}, _vcTree.TreeNode.props, {
    value: String
  }),
  render: function render() {
    return this;
  }
};
module.exports = exports['default'];