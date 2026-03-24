import type { Slot, ScopedSlot } from '@/utils/types'

export interface MentionOption {
  value: string
  label?: string
  disabled?: boolean
}

export type MentionsPlacement = 'top' | 'bottom'
export type MentionsStatus = 'error' | 'warning'

export interface MentionsProps {
  /** Textarea value (v-model:value) */
  value?: string
  /** Default value */
  defaultValue?: string
  /** Suggestion options */
  options?: MentionOption[]
  /** Trigger prefix character(s) */
  prefix?: string | string[]
  /** Separator between mention and following text */
  split?: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the textarea is disabled */
  disabled?: boolean
  /** Whether the textarea is readonly */
  readonly?: boolean
  /** Number of rows */
  rows?: number
  /** Auto focus on mount */
  autofocus?: boolean
  /** Dropdown placement */
  placement?: MentionsPlacement
  /** Custom filter function */
  filterOption?: boolean | ((inputValue: string, option: MentionOption) => boolean)
  /** Content when no options match */
  notFoundContent?: string
  /** Custom popup container */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /** Validation status */
  status?: MentionsStatus
  /** Input id */
  id?: string
}

export const mentionsDefaultProps = {
  prefix: '@',
  split: ' ',
  rows: 1,
  placement: 'bottom' as MentionsPlacement,
  filterOption: true,
}

export interface MentionsEmits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
  (e: 'select', option: MentionOption, prefix: string): void
  (e: 'search', value: string, prefix: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface MentionsSlots {
  /** Custom option rendering */
  option?: ScopedSlot<{ value: string; label?: string; disabled?: boolean }>
  /** Content when no options match */
  notFoundContent?: Slot
}
