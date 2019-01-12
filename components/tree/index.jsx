import Tree from './Tree';
import DirectoryTree from './DirectoryTree';

Tree.TreeNode.name = 'ATreeNode';
Tree.DirectoryTree = DirectoryTree;
/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
  Vue.component(Tree.TreeNode.name, Tree.TreeNode);
  Vue.component(DirectoryTree.name, DirectoryTree);
};

export default Tree;
