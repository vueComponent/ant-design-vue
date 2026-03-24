import type { Slot } from '@/utils/types'

export interface SwitchProps {
  /** Current value (v-model:checked) */
  checked?: boolean | string | number
  /** Value when checked */
  checkedValue?: boolean | string | number
  /** Value when unchecked */
  unCheckedValue?: boolean | string | number
  /** Whether the switch is disabled */
  disabled?: boolean
  /** Whether the switch is in loading state */
  loading?: boolean
  /** Size of the switch */
  size?: 'small' | 'default'
  /** Whether to auto-focus on mount */
  autofocus?: boolean
  /** Element id */
  id?: string
  /** Tab order of the switch */
  tabindex?: string | number
}

export const switchDefaultProps = {
  checkedValue: true,
  unCheckedValue: false,
  loading: false,
  size: 'default',
} as const

export interface SwitchEmits {
  (e: 'update:checked', value: boolean | string | number): void
  (e: 'change', checked: boolean | string | number, event: MouseEvent | KeyboardEvent): void
  (e: 'click', checked: boolean | string | number, event: MouseEvent): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'mouseup', event: MouseEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

export interface SwitchSlots {
  /** Content shown when checked */
  checkedChildren?: Slot
  /** Content shown when unchecked */
  unCheckedChildren?: Slot
}
