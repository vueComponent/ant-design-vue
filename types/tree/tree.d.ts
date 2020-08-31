// Project: https://github.com/vueComponent/ant-design-vue Definitions by:
// akki-jat <https://github.com/akki-jat> Definitions:
// https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent, AntdProps } from '../component';
import { TreeNode } from '../tree-node';
import { DictionaryTree } from './dictionary-tree';
import { TreeData } from '../tree-select';
import { VNode } from 'vue';
export interface TreeProps {
  /**
   * Whether treeNode fill remaining horizontal space
   * @version 1.5.0
   */
  blockNode?: boolean;

  /**
   * whether can be selected
   */
  selectable?: boolean;
  /**
   * treeNode of tree
   * @type TreeNode[]
   */
  treeData?: TreeData[];

  /**
   *
   *@description Replace the title,key and children fields in treeNode with the corresponding fields in treeData
   */
  replaceFields?: {
    /**@default 'children' */
    children?: string;
    /**@default 'title' */
    title?: string;
    /**@default 'key' */
    key?: string;
  };

  /**
   * Whether to automatically expand a parent treeNode
   * @default true
   * @type boolean
   */
  autoExpandParent?: boolean;

  /**
   * Adds a Checkbox before the treeNodes
   * @default false
   * @type boolean
   */
  checkable?: boolean;

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
  checkedKeys?:
    | string[]
    | number[]
    | {
        checked: string[];
        halfChecked: string[];
      };

  /**
   * Check treeNode precisely; parent treeNode and children treeNodes are not associated
   * @default false
   * @type boolean
   */
  checkStrictly?: boolean;

  /**
   * Specifies the keys of the default checked treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultCheckedKeys?: string[] | number[];

  /**
   * Whether to expand all treeNodes by default
   * @default false
   * @type boolean
   */
  defaultExpandAll?: boolean;

  /**
   * Specify the keys of the default expanded treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultExpandedKeys?: string[] | number[];

  /**
   * auto expand parent treeNodes when init
   * @default true
   * @type boolean
   */
  defaultExpandParent?: boolean;

  /**
   * Specifies the keys of the default selected treeNodes
   * @default []
   * @type string[] | number[]
   */
  defaultSelectedKeys?: string[] | number[];

  /**
   * whether disabled the tree
   * @default false
   * @type boolean
   */
  disabled?: boolean;

  /**
   * Specifies whether this Tree is draggable (IE > 8)
   * @default false
   * @type boolean
   */
  draggable?: boolean;

  /**
   * (Controlled) Specifies the keys of the expanded treeNodes
   * @default []
   * @type string[] | number[]
   */
  expandedKeys?: string[] | number[];

  /**
   * Defines a function to filter (highlight) treeNodes.
   * When the function returns true, the corresponding treeNode will be highlighted
   * @type Function
   */
  filterTreeNode?: (node?: VNode) => any | boolean;

  /**
   * Load data asynchronously
   * @type Function
   */
  loadData?: (node?: VNode) => any;

  /**
   * (Controlled) Set loaded tree nodes. Need work with loadData
   * @default []
   * @type string[]
   */
  loadedKeys?: string[];

  /**
   * Allows selecting multiple treeNodes
   * @default false
   * @type boolean
   */
  multiple?: boolean;

  /**
   * (Controlled) Specifies the keys of the selected treeNodes
   * @type string[] | number[]
   */
  selectedKeys?: string[] | number[];

  /**
   * Shows the icon before a TreeNode's title.
   * There is no default style; you must set a custom style for it if set to true
   * @default false
   * @type boolean
   */
  showIcon?: boolean;

  /**
   * Shows a connecting line
   * @default false
   * @type boolean
   */
  showLine?: boolean;

  /**
   * Callback function for when the onCheck event occurs
   * @param checkedKeys
   * @param e
   */
  onClick?: (
    checkedKeys: string[],
    e: { checked: boolean; checkedNodes: any[]; node: any; event: any },
  ) => void;

  /**
   * Callback function for when the onDragEnd event occurs
   * @param event
   * @param node
   */
  onDragend?: ({ event, node }) => void;

  /**
   * Callback function for when the onDragEnter event occurs
   * @param event
   * @param node
   * @param expandedKeys
   */
  onDragenter?: ({ event, node, expandedKeys }) => void;

  /**
   * Callback function for when the onDragLeave event occurs
   * @param event
   * @param node
   */
  onDragleave?: ({ event, node }) => void;

  /**
   * Callback function for when the onDragOver event occurs
   * @param event
   * @param node
   */
  onDragover?: ({ event, node }) => void;

  /**
   * Callback function for when the onDragStart event occurs
   * @param event
   * @param node
   */
  onDragstart?: ({ event, node }) => void;

  /**
   * Callback function for when the onDrop event occurs
   *
   * @param event
   * @param node
   * @param dragNode
   * @param dragNodesKeys
   */
  onDrop?: ({ event, node, dragNode, dragNodesKeys }) => void;

  /**
   * Callback function for when a treeNode is expanded or collapsed
   * @param expandedKeys
   * @param bool
   * @param node
   */
  onExpand?: (expandedKeys: string[], { expanded, node }) => void;

  /**
   * 	Callback function for when a treeNode is loaded
   * @param loadedKeys
   * @param event
   * @param node
   */
  onLoad?: (loadedKeys: string[], { event, node }) => void;

  /**
   * Callback function for when the user right clicks a treeNode
   * @param event
   * @param node
   */
  onRightClick?: ({ event, node }) => void;

  /**
   * Callback function for when the user clicks a treeNode
   * @param selectedKeys
   * @param event
   */
  onSelect?: (selectedKeys: string[], event: { selected; selectedNodes; node; event }) => void;
}
export declare class Tree extends AntdComponent {
  static TreeNode: typeof TreeNode;
  static DirectoryTree: typeof DictionaryTree;

  $props: TreeProps;
}
