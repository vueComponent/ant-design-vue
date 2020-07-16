import Tree from './Tree';
import DirectoryTree from './DirectoryTree';

Tree.TreeNode.name = 'ATreeNode';
Tree.DirectoryTree = DirectoryTree;
/* istanbul ignore next */
Tree.install = function(app) {
  app.component(Tree.name, Tree);
  app.component(Tree.TreeNode.name, Tree.TreeNode);
  app.component(DirectoryTree.name, DirectoryTree);
};

export default Tree;
