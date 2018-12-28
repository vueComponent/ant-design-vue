import { AntdVueComponent } from './component';
import { VNode } from 'vue';

/** ATree Layout Component */
export declare class ATree extends AntdVueComponent {
  treeData: any

  autoExpandParent: boolean

  checkable: boolean

  checkedKeys: string[] | {checked: string[], halfChecked: string[]}

  checkStrictly: boolean

  defaultCheckedKeys: string[]

  defaultExpandAll: boolean

  defaultExpandedKeys: string[]

  defaultExpandParent: boolean

  defaultSelectedKeys: string[]

  disabled: boolean

  draggable: boolean

  expandedKeys: string[]

  filterTreeNode: (node: any) => boolean

  loadData: (node: any) => any

  multiple: boolean

  selectedKeys: string[]

  showIcon: boolean

  showLine: boolean

  check: (checkedKeys: any,
    e:{checked: boolean, checkedNodes: any, node: any, event: Event}) => void

  dragEnd: (params: { event: Event, node: any }) => void

  dragEnter: (params: { event: Event, node: any, expandedKeys: any }) => void

  dragLeave: (params: { event: Event, node: any }) => void

  dragOver: (params: { event: Event, node: any }) => void

  dragStart: (params: { event: Event, node: any }) => void

  drop: (params: {event: Event, node: any, dragNode: any, dragNodesKeys: any}) => void

  expand: (expandedKeys: any, opt: {expanded: boolean, node: any}) => void

  rightClick: (params: {event: Event, node: any}) => void

  select: (selectedKeys: any,
    e:{selected: boolean, selectedNodes: any, node: any, event: Event}) => void
}

export interface TreeNode {
  class: string

  style: string | object

  disableCheckbox: boolean

  disabled: boolean

  icon: VNode

  isLeaf: boolean

  key: string

  selectable: boolean

  title: string | VNode

  slots: object

  scopedSlots: object

  on: object
}
