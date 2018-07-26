import _extends from 'babel-runtime/helpers/extends';
// export this package's api
import TreeSelect from './Select';
import TreeNode from './TreeNode';
import omit from 'omit.js';
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './strategies';
TreeSelect.TreeNode = TreeNode;

export default {
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        listeners = context.listeners,
        _context$children = context.children,
        children = _context$children === undefined ? [] : _context$children,
        data = context.data;

    var treeSelectProps = _extends({}, omit(data, ['attrs']), {
      props: _extends({}, props, {
        children: children,
        __propsSymbol__: Symbol()
      }),
      on: listeners
    });
    return h(TreeSelect, treeSelectProps);
  },

  TreeNode: TreeNode,
  SHOW_ALL: SHOW_ALL, SHOW_PARENT: SHOW_PARENT, SHOW_CHILD: SHOW_CHILD
};
export { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD };