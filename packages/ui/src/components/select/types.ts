import type { VNode } from 'vue'
import type { Slot, ScopedSlot } from '@/utils/types'

// ---------------------------------------------------------------------------
// Option types
// ---------------------------------------------------------------------------

export interface SelectOption {
  value?: string | number
  label?: string | VNode
  disabled?: boolean
  title?: string
  /** Custom class for the option */
  class?: string
  /** Allow arbitrary fields when using fieldNames */
  [key: string]: any
}

export interface SelectOptGroup {
  label?: string | VNode
  options: SelectOption[]
}

/** A flat or grouped option entry */
export type SelectOptionType = SelectOption | SelectOptGroup

export function isOptGroup(opt: SelectOptionType): opt is SelectOptGroup {
  return 'options' in opt && Array.isArray((opt as SelectOptGroup).options)
}

// ---------------------------------------------------------------------------
// LabeledValue (when labelInValue=true)
// ---------------------------------------------------------------------------

export interface LabeledValue {
  value: string | number
  label?: string | VNode
  key?: string | number
}

// ---------------------------------------------------------------------------
// Select value types
// ---------------------------------------------------------------------------

export type SelectValue =
  | string
  | number
  | LabeledValue
  | (string | number)[]
  | LabeledValue[]
  | null
  | undefined

// ---------------------------------------------------------------------------
// Select mode
// ---------------------------------------------------------------------------

export type SelectMode = 'multiple' | 'tags'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type SelectSize = 'small' | 'middle' | 'large'
export type SelectStatus = 'error' | 'warning'
export type SelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export interface SelectProps {
  /** Selected value (v-model:value) */
  value?: SelectValue
  /** Default selected value */
  defaultValue?: SelectValue
  /** Selection mode: undefined = single, 'multiple', 'tags' */
  mode?: SelectMode
  /** Data-driven options */
  options?: SelectOptionType[]
  /** Custom field names mapping */
  fieldNames?: { label?: string; value?: string; options?: string }
  /** Placeholder text */
  placeholder?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Allow clearing the selection */
  allowClear?: boolean
  /** Show search input */
  showSearch?: boolean
  /** Controlled search value */
  searchValue?: string
  /** Custom filter function, false to disable */
  filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean)
  /** Sort function for filtered options */
  filterSort?: (a: SelectOption, b: SelectOption) => number
  /** Auto clear search after selection (multiple/tags) */
  autoClearSearchValue?: boolean
  /** Which option field to filter on */
  optionFilterProp?: string
  /** Return {value, label} instead of raw value */
  labelInValue?: boolean
  /** Enable virtual scrolling */
  virtual?: boolean
  /** Virtual list container height */
  listHeight?: number
  /** Virtual list item height */
  listItemHeight?: number
  /** Component size */
  size?: SelectSize
  /** Validation status */
  status?: SelectStatus
  /** Whether to show border */
  bordered?: boolean
  /** Whether to show the dropdown arrow */
  showArrow?: boolean
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
  placement?: SelectPlacement
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Max tags to display in multiple mode */
  maxTagCount?: number | 'responsive'
  /** Max text length per tag */
  maxTagTextLength?: number
  /** Token separators for tags mode */
  tokenSeparators?: string[]
  /** Highlight first option by default */
  defaultActiveFirstOption?: boolean
  /** Auto focus on mount */
  autofocus?: boolean
  /** Id for the input */
  id?: string
}

export const selectDefaultProps = {
  bordered: true,
  showSearch: undefined as boolean | undefined,
  showArrow: undefined as boolean | undefined,
  virtual: true,
  listHeight: 256,
  listItemHeight: 24,
  filterOption: true as boolean | ((inputValue: string, option: SelectOption) => boolean),
  autoClearSearchValue: true,
  optionFilterProp: 'label',
  defaultActiveFirstOption: true,
  placement: 'bottomLeft' as SelectPlacement,
  dropdownMatchSelectWidth: true,
} as const

// ---------------------------------------------------------------------------
// Emits
// ---------------------------------------------------------------------------

export interface SelectEmits {
  (e: 'update:value', value: SelectValue): void
  (e: 'change', value: SelectValue, option: SelectOption | SelectOption[]): void
  (e: 'select', value: string | number, option: SelectOption): void
  (e: 'deselect', value: string | number, option: SelectOption): void
  (e: 'search', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'dropdownVisibleChange', open: boolean): void
  (e: 'update:open', open: boolean): void
  (e: 'update:searchValue', value: string): void
  (e: 'clear'): void
  (e: 'inputKeydown', event: KeyboardEvent): void
  (e: 'popupScroll', event: Event): void
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

export interface SelectSlots {
  /** Custom option rendering */
  option?: ScopedSlot<{ value: string | number; label: any; disabled?: boolean }>
  /** Custom dropdown footer or wrapper */
  dropdownRender?: ScopedSlot<{ menuNode: VNode }>
  /** Content when no options match */
  notFoundContent?: Slot
  /** Suffix icon (dropdown arrow) */
  suffixIcon?: Slot
  /** Clear button icon */
  clearIcon?: Slot
  /** Remove icon for tags */
  removeIcon?: Slot
  /** Custom tag render for multiple/tags mode */
  tagRender?: ScopedSlot<{ value: string | number; label: any; closable: boolean; onClose: () => void }>
  /** Overflow tag placeholder in multiple mode */
  maxTagPlaceholder?: ScopedSlot<{ omittedValues: LabeledValue[] }>
  /** Placeholder content */
  placeholder?: Slot
}
