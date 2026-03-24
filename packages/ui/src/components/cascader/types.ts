import type { VNode } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'

// ---------------------------------------------------------------------------
// Option types
// ---------------------------------------------------------------------------

export interface CascaderOption {
  value?: string | number
  label?: string
  disabled?: boolean
  children?: CascaderOption[]
  isLeaf?: boolean
  loading?: boolean
  /** Allow arbitrary fields when using fieldNames */
  [key: string]: any
}

export interface CascaderFieldNames {
  label?: string
  value?: string
  children?: string
}

// ---------------------------------------------------------------------------
// Show checked strategy
// ---------------------------------------------------------------------------

export type ShowCheckedStrategy = 'SHOW_PARENT' | 'SHOW_CHILD'

// ---------------------------------------------------------------------------
// Search config
// ---------------------------------------------------------------------------

export interface CascaderShowSearchConfig {
  filter?: (inputValue: string, path: CascaderOption[]) => boolean
  limit?: number | false
  render?: (props: { inputValue: string; path: CascaderOption[] }) => VNode | string
  sort?: (a: CascaderOption[], b: CascaderOption[], inputValue: string) => number
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type CascaderSize = 'small' | 'middle' | 'large'
export type CascaderStatus = 'error' | 'warning'
export type CascaderPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type CascaderExpandTrigger = 'click' | 'hover'

export type CascaderValueType = (string | number)[] | (string | number)[][]

export interface CascaderProps {
  /** Selected value path(s) (v-model:value) */
  value?: CascaderValueType
  /** Default selected value */
  defaultValue?: CascaderValueType
  /** Tree data options */
  options?: CascaderOption[]
  /** Custom field names */
  fieldNames?: CascaderFieldNames
  /** Placeholder text */
  placeholder?: string
  /** Whether the cascader is disabled */
  disabled?: boolean
  /** Allow clearing */
  allowClear?: boolean
  /** Enable search */
  showSearch?: boolean | CascaderShowSearchConfig
  /** Controlled search value */
  searchValue?: string
  /** Trigger change on intermediate selection */
  changeOnSelect?: boolean
  /** Expand trigger: click or hover */
  expandTrigger?: CascaderExpandTrigger
  /** Enable multiple selection */
  multiple?: boolean
  /** Which checked nodes to show in multiple mode */
  showCheckedStrategy?: ShowCheckedStrategy
  /** Component size */
  size?: CascaderSize
  /** Validation status */
  status?: CascaderStatus
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
  /** Custom dropdown class */
  popupClassName?: string
  /** Dropdown placement */
  placement?: CascaderPlacement
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Lazy load function */
  loadData?: (selectedOptions: CascaderOption[]) => void
  /** Max tags in multiple mode */
  maxTagCount?: number
  /** Show dropdown arrow */
  showArrow?: boolean
  /** Auto focus on mount */
  autofocus?: boolean
  /** Input id */
  id?: string
}

export const cascaderDefaultProps = {
  bordered: true,
  allowClear: true,
  expandTrigger: 'click' as CascaderExpandTrigger,
  placement: 'bottomLeft' as CascaderPlacement,
  showCheckedStrategy: 'SHOW_PARENT' as ShowCheckedStrategy,
  showArrow: undefined as boolean | undefined,
} as const

// ---------------------------------------------------------------------------
// Emits
// ---------------------------------------------------------------------------

export interface CascaderEmits {
  (e: 'update:value', value: CascaderValueType): void
  (e: 'change', value: CascaderValueType, selectedOptions: CascaderOption[]): void
  (e: 'search', value: string): void
  (e: 'dropdownVisibleChange', open: boolean): void
  (e: 'update:open', open: boolean): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

export interface CascaderSlots {
  /** Custom display of selected value */
  displayRender?: ScopedSlot<{ labels: string[]; selectedOptions: CascaderOption[] }>
  /** Custom expand icon */
  expandIcon?: Slot
  /** Content when no options */
  notFoundContent?: Slot
  /** Suffix icon */
  suffixIcon?: Slot
  /** Clear icon */
  clearIcon?: Slot
  /** Remove icon for tags */
  removeIcon?: Slot
  /** Tag render for multiple mode */
  tagRender?: ScopedSlot<{ value: (string | number)[]; label: string; closable: boolean; onClose: () => void }>
  /** Overflow tag placeholder */
  maxTagPlaceholder?: ScopedSlot<{ omittedValues: (string | number)[][] }>
}
