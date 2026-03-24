import type { Slot, ScopedSlot } from '@/utils/types'

export interface AutoCompleteOption {
  value: string
  label?: string
  disabled?: boolean
}

export type AutoCompleteSize = 'small' | 'middle' | 'large'
export type AutoCompleteStatus = 'error' | 'warning'
export type AutoCompletePlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export interface AutoCompleteProps {
  /** Current value (v-model:value) */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Suggestion options */
  options?: AutoCompleteOption[]
  /** Placeholder text */
  placeholder?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Allow clearing */
  allowClear?: boolean
  /** Backfill selected option into input */
  backfill?: boolean
  /** Custom filter function, false to disable */
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean)
  /** Highlight first option */
  defaultActiveFirstOption?: boolean
  /** Dropdown open state (controlled) */
  open?: boolean
  /** Default dropdown open state */
  defaultOpen?: boolean
  /** Custom dropdown class */
  popupClassName?: string
  /** Dropdown placement */
  placement?: AutoCompletePlacement
  /** Sync dropdown width with input */
  dropdownMatchSelectWidth?: boolean | number
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Component size */
  size?: AutoCompleteSize
  /** Validation status */
  status?: AutoCompleteStatus
  /** Whether to show border */
  bordered?: boolean
  /** Auto focus on mount */
  autofocus?: boolean
  /** Virtual scrolling */
  virtual?: boolean
  /** Virtual list height */
  listHeight?: number
  /** Input id */
  id?: string
}

export const autoCompleteDefaultProps = {
  bordered: true,
  defaultActiveFirstOption: true,
  filterOption: false as boolean | ((inputValue: string, option: AutoCompleteOption) => boolean),
  placement: 'bottomLeft' as AutoCompletePlacement,
  dropdownMatchSelectWidth: true,
  virtual: true,
  listHeight: 256,
} as const

export interface AutoCompleteEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
  (e: 'select', value: string, option: AutoCompleteOption): void
  (e: 'search', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'dropdownVisibleChange', open: boolean): void
  (e: 'clear'): void
}

export interface AutoCompleteSlots {
  /** Custom input element */
  default?: Slot
  /** Custom option rendering */
  option?: ScopedSlot<{ value: string; label?: string; disabled?: boolean; [key: string]: any }>
  /** Content when no options match */
  notFoundContent?: Slot
  /** Clear button icon */
  clearIcon?: Slot
}
