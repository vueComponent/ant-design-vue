import _extends from 'babel-runtime/helpers/extends';
import { getOptionProps } from '../../_util/props-util';
import Tree from './Tree';
import TreeNode from './TreeNode';
Tree.TreeNode = TreeNode;

//
var NewTree = {
  TreeNode: TreeNode,
  props: Tree.props,
  render: function render() {
    var h = arguments[0];
    var $listeners = this.$listeners,
        $slots = this.$slots;

    var treeProps = {
      props: _extends({}, getOptionProps(this), {
        children: $slots['default']
      }),
      on: $listeners
    };
    return h(
      Tree,
      treeProps,
      [$slots['default']]
    );
  }
};
export { TreeNode };
export default NewTree;