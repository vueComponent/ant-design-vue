// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { TreeNode } from '../tree-node';
import { DictionaryTree } from './dictionary-tree';

export declare class Tree extends AntdComponent {
  static TreeNode: typeof TreeNode;
  static DirectoryTree: typeof DictionaryTree;

  /**
   * treeNode of tree
   * @type TreeNode[]
   */
  treeData: TreeNode[];

  /**
   * Whether to automatically expand a parent treeNode
   * @default true
   * @type boolean
   */
  autoExpandParent: boolean;

  /**
   * Adds a Checkbox before the treeNodes
   * @default false
   * @type boolean
   */
  checkable: boolean;

  /**
   * (Controlled) Specifies the keys of the checked treeNodes
   * (PS: When this specifies the key of a treeNode which is also a parent treeNode,
   * all the children treeNodes of will be checked; and vice versa,
   * when it specifies the key of a treeNode which is a child treeNode,
   * its parent treeNode will also be checked. When checkable and checkStrictly is true,
   * its object has checked and halfChecked property. Regardless of whether the child or parent treeNode is checked,
   * they won't impact each other.
   * @default []
   * @type string[] | number[] | { checked: string[]; halfChecked: string[] }
   */
  checkedKeys: string[] | number[] | { checked: string[]; halfChecked: string[] };

  /**
   * Check treeNode precisely; parent treeNode and children treeNodes are not associated
   * @default false
   * @type boolean
   */
  checkStrictly: boolean;

  /**
   * Specifies the keys of the default checked treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultCheckedKeys: string[] | number[];

  /**
   * Whether to expand all treeNodes by default
   * @default false
   * @type boolean
   */
  defaultExpandAll: boolean;

  /**
   * Specify the keys of the default expanded treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultExpandedKeys: string[] | number[];

  /**
   * auto expand parent treeNodes when init
   * @default true
   * @type boolean
   */
  defaultExpandParent: boolean;

  /**
   * Specifies the keys of the default selected treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultSelectedKeys: string[] | number[];

  /**
   * whether disabled the tree
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * Specifies whether this Tree is draggable (IE > 8)
   * @default false
   * @type boolean
   */
  draggable: boolean;

  /**
   * (Controlled) Specifies the keys of the expanded treeNodes
   * @default []
   * @type string[] | number[]
   */
  expandedKeys: string[] | number[];

  /**
   * Defines a function to filter (highlight) treeNodes.
   * When the function returns true, the corresponding treeNode will be highlighted
   * @type Function
   */
  filterTreeNode: (node: TreeNode) => any;

  /**
   * Load data asynchronously
   * @type Function
   */
  loadData: (node: TreeNode) => any;

  /**
   * (Controlled) Set loaded tree nodes. Need work with loadData
   * @default []
   * @type string[]
   */
  loadedKeys: string[];

  /**
   * Allows selecting multiple treeNodes
   * @default false
   * @type boolean
   */
  multiple: boolean;

  /**
   * (Controlled) Specifies the keys of the selected treeNodes
   * @type string[] | number[]
   */
  selectedKeys: string[] | number[];

  /**
   * Shows the icon before a TreeNode's title.
   * There is no default style; you must set a custom style for it if set to true
   * @default false
   * @type boolean
   */
  showIcon: boolean;

  /**
   * Shows a connecting line
   * @default false
   * @type boolean
   */
  showLine: boolean;
}
