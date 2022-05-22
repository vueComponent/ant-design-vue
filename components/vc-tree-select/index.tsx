// base rc-tree-select@5.4.0
import type { TreeSelectProps } from './TreeSelect';
import TreeSelect, { treeSelectProps } from './TreeSelect';
import TreeNode from './TreeNode';
import { SHOW_ALL, SHOW_CHILD, SHOW_PARENT } from './utils/strategyUtil';

export { TreeNode, SHOW_ALL, SHOW_CHILD, SHOW_PARENT, treeSelectProps };
export type { TreeSelectProps };

export default TreeSelect;
