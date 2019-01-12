import ProxyTree, { Tree } from './Tree';
import TreeNode from './TreeNode';
Tree.TreeNode = TreeNode;
ProxyTree.TreeNode = TreeNode;

export { Tree, TreeNode };
export default ProxyTree;
