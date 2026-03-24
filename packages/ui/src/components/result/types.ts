import type { Slot } from '@/utils/types'

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 403 | 404 | 500 | '403' | '404' | '500'

export interface ResultProps {
  /** Result status, decides icon and color */
  status?: ResultStatus
  /** Title text */
  title?: string
  /** Subtitle text */
  subTitle?: string
}

export const resultDefaultProps = {
  status: 'info',
} as const

export interface ResultSlots {
  default?: Slot
  title?: Slot
  subTitle?: Slot
  icon?: Slot
  extra?: Slot
}
