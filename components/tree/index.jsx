import Tree from './Tree';
import DirectoryTree from './DirectoryTree';
import Base from '../base';

Tree.TreeNode.name = 'ATreeNode';
Tree.DirectoryTree = DirectoryTree;
/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Tree.name, Tree);
  Vue.component(Tree.TreeNode.name, Tree.TreeNode);
  Vue.component(DirectoryTree.name, DirectoryTree);
};

export default Tree;
