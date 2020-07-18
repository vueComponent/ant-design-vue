import { TreeNode } from '../../vc-tree';
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
function SelectNode(_, { attrs, slots }) {
  return <TreeNode {...attrs} vSlots={slots} />;
}

SelectNode.isTreeNode = true;
SelectNode.inheritAttrs = false;
export default SelectNode;
