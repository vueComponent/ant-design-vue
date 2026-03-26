import type { Slot } from '@/utils/types'

export interface AlertProps {
  /** Alert type */
  type?: 'success' | 'info' | 'warning' | 'error'
  /** Whether alert can be closed */
  closable?: boolean
  /** Main message content */
  message?: string
  /** Additional description text */
  description?: string
  /** Whether to show type icon */
  showIcon?: boolean
  /** Display as banner (full-width, no border, no icon default) */
  banner?: boolean
  /** Close text/node - any string, component or boolean (deprecated: use closeText slot instead) */
  closeText?: any
  /** Callback after close animation finishes */
  afterClose?: () => void
}

export const alertDefaultProps = {
  type: 'info',
  closable: false,
  showIcon: false,
  banner: false,
} as const

export interface AlertEmits {
  (e: 'close', event: MouseEvent): void
}

export interface AlertSlots {
  default?: Slot
  message?: Slot
  description?: Slot
  icon?: Slot
  closeIcon?: Slot
  closeText?: Slot
  action?: Slot
}
