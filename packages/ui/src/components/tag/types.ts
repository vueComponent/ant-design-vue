import type { Slot } from '@/utils/types'

export type PresetColor =
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'green'
  | 'magenta'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'volcano'
  | 'geekblue'
  | 'lime'
  | 'gold'

export type PresetStatusColor = 'success' | 'processing' | 'error' | 'default' | 'warning'

export interface TagProps {
  /** Tag color — preset name, status name, or custom CSS color */
  color?: PresetColor | PresetStatusColor | string
  /** Whether tag can be closed */
  closable?: boolean
  /** Whether tag has a visible border */
  bordered?: boolean
  /** @deprecated Use `v-show` instead */
  visible?: boolean
}

export const tagDefaultProps = {
  closable: false,
  bordered: true,
  visible: undefined,
} as const

export interface TagEmits {
  (e: 'close', event: MouseEvent): void
  (e: 'click', event: MouseEvent): void
  (e: 'update:visible', visible: boolean): void
}

export interface TagSlots {
  default?: Slot
  icon?: Slot
  closeIcon?: Slot
}

export interface CheckableTagProps {
  /** Whether the tag is checked */
  checked?: boolean
}

export interface CheckableTagEmits {
  (e: 'update:checked', checked: boolean): void
  (e: 'change', checked: boolean): void
  (e: 'click', event: MouseEvent): void
}

export interface CheckableTagSlots {
  default?: Slot
}

// Helper to detect preset colors
const PRESET_COLORS: string[] = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
]

const PRESET_STATUS_COLORS: string[] = ['success', 'processing', 'error', 'default', 'warning']

export function isPresetColor(color?: string): boolean {
  return !!color && PRESET_COLORS.includes(color)
}

export function isPresetStatusColor(color?: string): boolean {
  return !!color && PRESET_STATUS_COLORS.includes(color)
}
