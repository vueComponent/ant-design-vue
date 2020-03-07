// Project: https://github.com/vueComponent/ant-design-vue Definitions by:
// akki-jat <https://github.com/akki-jat> Definitions:
// https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';
import { TreeNode } from './tree-node';

export interface TreeData {
  key: string | number;
  value: string;
  label: any;
  children: any;
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
}

export type TreeNodeValue = string | number | string[] | number[];

export declare class TreeSelect extends AntdComponent {
  static TreeNode: typeof TreeNode;

  treeIcon?: boolean;

  notFoundContent?: any;

  /**
   * Whether allow clear
   * @default false
   * @type boolean
   */
  allowClear: boolean;

  defaultValue: TreeNodeValue;

  /**
   * Disabled or not
   * @default false
   * @type boolean
   */
  disabled: boolean;

  /**
   * className of dropdown menu
   * @type string
   */
  dropdownClassName: string;

  /**
   * Determine whether the dropdown menu and the select input are the same width
   * @default true
   * @type boolean
   */
  dropdownMatchSelectWidth: boolean;

  /**
   * To set the style of the dropdown menu
   * @type object
   */
  dropdownStyle: object;

  /**
   * Whether to filter treeNodes by input value. The value of treeNodeFilterProp is used for filtering by default.
   * @default Function
   * @type boolean | Function
   */
  filterTreeNode: boolean | Function;

  /**
   * To set the container of the dropdown menu.
   * The default is to create a div element in body, you can reset it to the scrolling area and make a relative reposition.
   * @default () => document.body
   * @type Function
   */
  getPopupContainer: (triggerNode: any) => HTMLElement;

  /**
   * whether to embed label in value, turn the format of value from string to {value: string, label: VNode, halfChecked: string[]}
   * @default false
   * @type boolean
   */
  labelInValue: boolean;

  /**
   * Load data asynchronously.
   * @type
   */
  loadData: (node: any) => void;

  maxTagCount: number;

  maxTagPlaceholder: any;

  /**
   * Support multiple or not, will be true when enable treeCheckable.
   * @default false
   * @type boolean
   */
  multiple: boolean;

  /**
   * Placeholder of the select input
   * @type any (string | slot)
   */
  placeholder: any;

  /**
   * Placeholder of the search input
   * @type any (string | slot)
   */
  searchPlaceholder: any;

  /**
   * work with `search` event to make search value controlled.
   * @type string
   */
  searchValue: string;

  /**
   * Show Checked Strategy
   * @description The way show selected item in box. Default: just show child nodes.
   * TreeSelect.SHOW_ALL: show all checked treeNodes (include parent treeNode).
   * TreeSelect.SHOW_PARENT: show checked treeNodes (just show parent treeNode).
   * @default TreeSelect.SHOW_CHILD
   * @type
   */
  showCheckedStrategy: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD';

  /**
   * Whether to display a search input in the dropdown menu(valid only in the single mode)
   * @default false
   * @type boolean
   */
  showSearch: boolean;

  /**
   * To set the size of the select input, options: large small
   * @default 'default'
   * @type string
   */
  size: 'small' | 'large' | 'default';

  /**
   * Whether to show checkbox on the treeNodes
   * @default false
   * @type boolean
   */
  treeCheckable: boolean;

  /**
   * Whether to check nodes precisely (in the checkable mode), means parent and
   * child nodes are not associated, and it will make labelInValue be true
   * @default false
   * @type boolean
   */
  treeCheckStrictly: boolean;

  /**
   * Data of the treeNodes, manual construction work is no longer needed
   * if this property has been set(ensure the Uniqueness of each value)
   * @default []
   * @type object[]
   */
  treeData: TreeData[];

  /**
   * Enable simple mode of treeData.
   * (treeData should like this: [{id:1, pId:0, value:'1', label:"test1",...},...], pId is parent node's id)
   * @default false
   * @type boolean | object[]
   */
  treeDataSimpleMode:
    | boolean
    | Array<{
        id: string;
        pId: string;
        rootPId: any;
      }>;

  /**
   * Whether to expand all treeNodes by default
   * @default false
   * @type boolean
   */
  treeDefaultExpandAll: boolean;

  /**
   * Default expanded treeNodes
   * @type string[] | number[]
   */
  treeDefaultExpandedKeys: string[] | number[];

  /**
   * Set expanded keys
   * @type string[] | number[]
   */
  treeExpandedKeys: string[] | number[];

  /**
   * Will be used for filtering if filterTreeNode returns true
   * @default 'value'
   * @type string
   */
  treeNodeFilterProp: string;

  /**
   * Will render as content of select
   * @default 'title'
   * @type string
   */
  treeNodeLabelProp: string;

  value: TreeNodeValue;

  /**
   * The custom suffix icon
   * @type any (VNode | slot)
   */
  suffixIcon: any;

  removeIcon?: any;

  clearIcon?: any;

  /**
   * remove focus
   */
  blur(): void;

  /**
   * get focus
   */
  focus(): void;
}
