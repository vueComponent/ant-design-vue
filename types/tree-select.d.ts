import { VNode } from 'vue';
import { AntdVueComponent, AntdVueComponentSize } from './component';

export declare class TreeNode extends AntdVueComponent {
  disableCheckbox: boolean

  disabled: boolean

  isLeaf: boolean

  key: string

  title: string | VNode

  value: string

  scopedSlots: object
}

/** ATreeSelect Layout Component */
export declare class ATreeSelect extends AntdVueComponent {
  allowClear: boolean

  defaultValue: string | string[]

  disabled: boolean

  dropdownClassName: string

  dropdownMatchSelectWidth: boolean

  dropdownStyle: object

  filterTreeNode: (inputValue: string, treeNode: TreeNode) => boolean | boolean

  getPopupContainer(triggerNode: VNode): HTMLElement

  labelInValue: boolean

  loadData(node: TreeNode): any

  multiple: boolean

  placeholder: string | VNode

  searchPlaceholder: string | VNode

  showCheckedStrategy: any

  showSearch: boolean

  size: AntdVueComponentSize

  suffixIcon: VNode

  treeCheckable: boolean

  treeCheckStrictly: boolean

  treeData: Array<{value: any, label: string, children: any }>

  treeDataSimpleMode: false | Array<{ id: string, pId: string, rootPId: null }>

  treeDefaultExpandAll: boolean

  treeDefaultExpandedKeys: string[]

  treeNodeFilterProp: string

  treeNodeLabelProp: string

  value: string | string

  change(value: any, label: any, extra: any): void

  search(value: string): void

  select(value: any, node: TreeNode, extra: any): void

  blur(): void

  focus(): void
}
