'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHOW_CHILD = exports.SHOW_PARENT = exports.SHOW_ALL = exports.TreeNode = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export this package's api
_Select2['default'].TreeNode = _TreeNode2['default'];

exports['default'] = {
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        listeners = context.listeners,
        _context$children = context.children,
        children = _context$children === undefined ? [] : _context$children,
        data = context.data;

    var treeSelectProps = (0, _extends3['default'])({}, (0, _omit2['default'])(data, ['attrs']), {
      props: (0, _extends3['default'])({}, props, {
        children: children,
        __propsSymbol__: Symbol()
      }),
      on: listeners
    });
    return h(_Select2['default'], treeSelectProps);
  },

  TreeNode: _TreeNode2['default'],
  SHOW_ALL: _strategies.SHOW_ALL, SHOW_PARENT: _strategies.SHOW_PARENT, SHOW_CHILD: _strategies.SHOW_CHILD
};
exports.TreeNode = _TreeNode2['default'];
exports.SHOW_ALL = _strategies.SHOW_ALL;
exports.SHOW_PARENT = _strategies.SHOW_PARENT;
exports.SHOW_CHILD = _strategies.SHOW_CHILD;