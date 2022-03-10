// based on rc-tree 2.1.3
'use strict';

import ProxyTree, { Tree } from './src/Tree';
import TreeNode from './src/TreeNode';
Tree.TreeNode = TreeNode;
ProxyTree.TreeNode = TreeNode;

export { Tree, TreeNode };
export default ProxyTree;
