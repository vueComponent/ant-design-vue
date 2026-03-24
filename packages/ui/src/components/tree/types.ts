import type { CSSProperties } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'

// ---------------------------------------------------------------------------
// Tree data node
// ---------------------------------------------------------------------------

export type Key = string | number

export interface TreeDataNode {
  key: Key
  title?: string
  children?: TreeDataNode[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  checkable?: boolean
  isLeaf?: boolean
  icon?: string
  switcherIcon?: string
  class?: string
  style?: CSSProperties
  [key: string]: any
}

export interface FieldNames {
  key?: string
  title?: string
  children?: string
}

// ---------------------------------------------------------------------------
// Event data — enriched node passed to event handlers
// ---------------------------------------------------------------------------

export interface EventDataNode extends TreeDataNode {
  expanded: boolean
  selected: boolean
  checked: boolean
  halfChecked: boolean
  loaded: boolean
  loading: boolean
  pos: string
  parent?: TreeDataNode
}

// ---------------------------------------------------------------------------
// Flat node — internal flattened representation for rendering
// ---------------------------------------------------------------------------

export interface FlatNode {
  key: Key
  title: string
  node: TreeDataNode
  level: number
  isLeaf: boolean
  expanded: boolean
  hasChildren: boolean
  disabled: boolean
  disableCheckbox: boolean
  selectable: boolean
  pos: string
  parent: FlatNode | null
}

// ---------------------------------------------------------------------------
// Drag drop info
// ---------------------------------------------------------------------------

export interface TreeDragInfo {
  event: DragEvent
  node: EventDataNode
}

export interface TreeDropInfo {
  event: DragEvent
  node: EventDataNode
  dragNode: EventDataNode
  dragNodesKeys: Key[]
  dropPosition: -1 | 0 | 1
  dropToGap: boolean
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TreeProps {
  /** Tree data */
  treeData?: TreeDataNode[]
  /** Custom field name mapping */
  fieldNames?: FieldNames
  /** Expanded node keys (v-model:expandedKeys) */
  expandedKeys?: Key[]
  /** Default expanded keys (uncontrolled) */
  defaultExpandedKeys?: Key[]
  /** Expand all nodes by default */
  defaultExpandAll?: boolean
  /** Auto-expand parent when expandedKeys changes */
  autoExpandParent?: boolean
  /** Selected node keys (v-model:selectedKeys) */
  selectedKeys?: Key[]
  /** Default selected keys (uncontrolled) */
  defaultSelectedKeys?: Key[]
  /** Checked node keys (v-model:checkedKeys) */
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] }
  /** Default checked keys (uncontrolled) */
  defaultCheckedKeys?: Key[]
  /** Enable checkboxes */
  checkable?: boolean
  /** Disable parent-child check relationship */
  checkStrictly?: boolean
  /** Enable node selection */
  selectable?: boolean
  /** Enable multi-select */
  multiple?: boolean
  /** Disable entire tree */
  disabled?: boolean
  /** Show node icons */
  showIcon?: boolean
  /** Show connection lines */
  showLine?: boolean | { showLeafIcon?: boolean }
  /** Make node titles take full row width */
  blockNode?: boolean
  /** Enable drag and drop */
  draggable?: boolean | ((node: TreeDataNode) => boolean)
  /** Validate whether drop is allowed */
  allowDrop?: (info: { dragNode: TreeDataNode; dropNode: TreeDataNode; dropPosition: -1 | 0 | 1 }) => boolean
  /** Enable virtual scrolling */
  virtual?: boolean
  /** Virtual scroll container height in px */
  height?: number
  /** Virtual scroll item height in px */
  itemHeight?: number
  /** Async load children */
  loadData?: (node: EventDataNode) => Promise<void>
  /** Filter/highlight nodes */
  filterTreeNode?: (node: TreeDataNode) => boolean
  /** Default icon for tree nodes */
  icon?: string
  /** Default switcher icon */
  switcherIcon?: string
  /** Loaded keys (for async loading) */
  loadedKeys?: Key[]
}

export const treeDefaultProps = {
  selectable: true,
  multiple: false,
  checkable: false,
  checkStrictly: false,
  disabled: false,
  showIcon: false,
  blockNode: false,
  virtual: true,
  itemHeight: 28,
  autoExpandParent: false,
  defaultExpandAll: false,
}

// ---------------------------------------------------------------------------
// Emits
// ---------------------------------------------------------------------------

export interface TreeEmits {
  (e: 'update:expandedKeys', keys: Key[]): void
  (e: 'expand', expandedKeys: Key[], info: { node: EventDataNode; expanded: boolean; nativeEvent: MouseEvent }): void
  (e: 'update:selectedKeys', keys: Key[]): void
  (e: 'select', selectedKeys: Key[], info: { event: 'select'; selected: boolean; node: EventDataNode; selectedNodes: TreeDataNode[]; nativeEvent: MouseEvent }): void
  (e: 'update:checkedKeys', keys: Key[] | { checked: Key[]; halfChecked: Key[] }): void
  (e: 'check', checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }, info: { event: 'check'; checked: boolean; node: EventDataNode; checkedNodes: TreeDataNode[]; halfCheckedKeys: Key[]; nativeEvent: MouseEvent }): void
  (e: 'dragstart', info: TreeDragInfo): void
  (e: 'dragenter', info: TreeDragInfo & { expandedKeys: Key[] }): void
  (e: 'dragover', info: TreeDragInfo): void
  (e: 'dragleave', info: TreeDragInfo): void
  (e: 'dragend', info: TreeDragInfo): void
  (e: 'drop', info: TreeDropInfo): void
  (e: 'load', loadedKeys: Key[], info: { event: 'load'; node: EventDataNode }): void
  (e: 'rightClick', info: { event: MouseEvent; node: EventDataNode }): void
  (e: 'update:loadedKeys', keys: Key[]): void
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

export interface TreeNodeSlotProps {
  key: Key
  title: string
  data: TreeDataNode
  expanded: boolean
  selected: boolean
  checked: boolean
  halfChecked: boolean
  isLeaf: boolean
  disabled: boolean
  pos: string
  loading: boolean
  /** Allow custom field names access */
  [key: string]: any
}

export interface TreeSlots {
  /** Custom title render */
  title?: ScopedSlot<TreeNodeSlotProps>
  /** Custom node icon */
  icon?: ScopedSlot<TreeNodeSlotProps>
  /** Custom expand/collapse icon */
  switcherIcon?: ScopedSlot<{ expanded: boolean; isLeaf: boolean; loading: boolean }>
  /** Custom leaf icon (when showLine with showLeafIcon) */
  leafIcon?: Slot
}

// ---------------------------------------------------------------------------
// DirectoryTree
// ---------------------------------------------------------------------------

export interface DirectoryTreeProps extends TreeProps {
  /** Expand trigger: click or double-click on title */
  expandAction?: false | 'click' | 'dblclick'
}

export const directoryTreeDefaultProps = {
  ...treeDefaultProps,
  showIcon: true,
  blockNode: true,
}

// ---------------------------------------------------------------------------
// Expose
// ---------------------------------------------------------------------------

export interface TreeExpose {
  /** Scroll to a specific node by key */
  scrollTo: (info: { key: Key; align?: 'top' | 'bottom' | 'auto'; offset?: number }) => void
}
