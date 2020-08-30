import VcTree from '../../vc-tree';
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
const TreeNode = VcTree.TreeNode;
function SelectNode(_, { attrs, slots }) {
  return <TreeNode {...attrs} vSlots={slots} />;
}

SelectNode.isTreeNode = true;
SelectNode.inheritAttrs = false;
export default SelectNode;
