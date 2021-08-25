import type { App, Plugin } from 'vue';
import Tree from './Tree';
import DirectoryTree from './DirectoryTree';

export type { EventDataNode, DataNode } from '../vc-tree/interface';

export type {
  TreeProps,
  AntTreeNodeMouseEvent,
  AntTreeNodeExpandedEvent,
  AntTreeNodeCheckedEvent,
  AntTreeNodeSelectedEvent,
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  AntdTreeNodeAttribute,
  TreeDataItem,
} from './Tree';

export type {
  ExpandAction as DirectoryTreeExpandAction,
  DirectoryTreeProps,
} from './DirectoryTree';

Tree.TreeNode.name = 'ATreeNode';
Tree.DirectoryTree = DirectoryTree;
/* istanbul ignore next */
Tree.install = function (app: App) {
  app.component(Tree.name, Tree);
  app.component(Tree.TreeNode.name, Tree.TreeNode);
  app.component(DirectoryTree.name, DirectoryTree);
  return app;
};

export const TreeNode = Tree.TreeNode;
export { DirectoryTree };
export default Tree as typeof Tree &
  Plugin & {
    readonly TreeNode: any;
    readonly DirectoryTree: typeof DirectoryTree;
  };
