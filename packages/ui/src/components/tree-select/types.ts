import type { VNode } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'

// ---------------------------------------------------------------------------
// Tree node type
// ---------------------------------------------------------------------------

export interface TreeSelectNode {
  value: string | number
  label?: string
  title?: string
  children?: TreeSelectNode[]
  disabled?: boolean
  disableCheckbox?: boolean
  isLeaf?: boolean
  selectable?: boolean
  checkable?: boolean
  loading?: boolean
}

export interface TreeSelectFieldNames {
  label?: string
  value?: string
  children?: string
}

// ---------------------------------------------------------------------------
// Show checked strategy
// ---------------------------------------------------------------------------

export type TreeSelectShowCheckedStrategy = 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'

// ---------------------------------------------------------------------------
// Value types
// ---------------------------------------------------------------------------

export interface TreeSelectLabeledValue {
  value: string | number
  label?: string | VNode
  halfChecked?: boolean
}

export type TreeSelectValue =
  | string
  | number
  | (string | number)[]
  | TreeSelectLabeledValue
  | TreeSelectLabeledValue[]
  | null
  | undefined

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type TreeSelectSize = 'small' | 'middle' | 'large'
export type TreeSelectStatus = 'error' | 'warning'
export type TreeSelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export interface TreeSelectProps {
  /** Selected value(s) (v-model:value) */
  value?: TreeSelectValue
  /** Default selected value */
  defaultValue?: TreeSelectValue
  /** Tree data */
  treeData?: TreeSelectNode[]
  /** Custom field names */
  fieldNames?: TreeSelectFieldNames
  /** Placeholder text */
  placeholder?: string
  /** Whether the tree select is disabled */
  disabled?: boolean
  /** Allow clearing */
  allowClear?: boolean
  /** Enable multiple selection */
  multiple?: boolean
  /** Show checkboxes (implies multiple) */
  treeCheckable?: boolean
  /** Parent/child check independence */
  treeCheckStrictly?: boolean
  /** Show search input */
  showSearch?: boolean
  /** Controlled search value */
  searchValue?: string
  /** Custom filter function */
  filterTreeNode?: boolean | ((inputValue: string, treeNode: TreeSelectNode) => boolean)
  /** Which field to filter on */
  treeNodeFilterProp?: string
  /** Return {value, label} instead of raw value */
  labelInValue?: boolean
  /** Expand all nodes initially */
  treeDefaultExpandAll?: boolean
  /** Default expanded keys */
  treeDefaultExpandedKeys?: (string | number)[]
  /** Controlled expanded keys */
  treeExpandedKeys?: (string | number)[]
  /** Show tree lines */
  treeLine?: boolean
  /** Show tree icons */
  treeIcon?: boolean
  /** Which checked nodes to display */
  showCheckedStrategy?: TreeSelectShowCheckedStrategy
  /** Component size */
  size?: TreeSelectSize
  /** Validation status */
  status?: TreeSelectStatus
  /** Whether to show border */
  bordered?: boolean
  /** Loading state */
  loading?: boolean
  /** Content when no options */
  notFoundContent?: string
  /** Dropdown open state (controlled) */
  open?: boolean
  /** Default dropdown open state */
  defaultOpen?: boolean
  /** Sync dropdown width with select */
  dropdownMatchSelectWidth?: boolean | number
  /** Custom dropdown style */
  dropdownStyle?: Record<string, string>
  /** Custom dropdown class */
  popupClassName?: string
  /** Dropdown placement */
  placement?: TreeSelectPlacement
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Virtual scrolling */
  virtual?: boolean
  /** Virtual list height */
  listHeight?: number
  /** Virtual list item height */
  listItemHeight?: number
  /** Lazy load function */
  loadData?: (node: TreeSelectNode) => Promise<void>
  /** Max tags in multiple mode */
  maxTagCount?: number
  /** Show arrow */
  showArrow?: boolean
  /** Auto focus on mount */
  autofocus?: boolean
  /** Input id */
  id?: string
}

export const treeSelectDefaultProps = {
  bordered: true,
  treeNodeFilterProp: 'label',
  placement: 'bottomLeft' as TreeSelectPlacement,
  dropdownMatchSelectWidth: true,
  virtual: true,
  listHeight: 256,
  listItemHeight: 28,
  showCheckedStrategy: 'SHOW_CHILD' as TreeSelectShowCheckedStrategy,
  showArrow: undefined as boolean | undefined,
} as const

// ---------------------------------------------------------------------------
// Emits
// ---------------------------------------------------------------------------

export interface TreeSelectEmits {
  (e: 'update:value', value: TreeSelectValue): void
  (e: 'change', value: TreeSelectValue, label: string[], extra: any): void
  (e: 'select', value: string | number, node: TreeSelectNode, extra: any): void
  (e: 'search', value: string): void
  (e: 'treeExpand', expandedKeys: (string | number)[]): void
  (e: 'update:treeExpandedKeys', keys: (string | number)[]): void
  (e: 'dropdownVisibleChange', open: boolean): void
  (e: 'update:open', open: boolean): void
  (e: 'update:searchValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

export interface TreeSelectSlots {
  /** Custom tree node content */
  title?: ScopedSlot<TreeSelectNode>
  /** Placeholder content */
  placeholder?: Slot
  /** Overflow tag placeholder */
  maxTagPlaceholder?: ScopedSlot<{ omittedValues: TreeSelectLabeledValue[] }>
  /** Custom tag render for multiple mode */
  tagRender?: ScopedSlot<{ value: string | number; label: any; closable: boolean; onClose: () => void }>
  /** Suffix icon */
  suffixIcon?: Slot
  /** Content when no options */
  notFoundContent?: Slot
  /** Expand/collapse icon */
  switcherIcon?: ScopedSlot<{ expanded: boolean; isLeaf: boolean }>
}
