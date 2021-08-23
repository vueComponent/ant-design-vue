/* istanbul ignore file */

import type { FunctionalComponent } from 'vue';
import type { DataNode, Key } from './interface';

export interface TreeNodeProps extends Omit<DataNode, 'children'> {
  value: Key;
}

/** This is a placeholder, not real render in dom */
const TreeNode: FunctionalComponent<TreeNodeProps> & { isTreeSelectNode: boolean } = () => null;
TreeNode.inheritAttrs = false;
TreeNode.displayName = 'ATreeSelectNode';
TreeNode.isTreeSelectNode = true;
export default TreeNode;
