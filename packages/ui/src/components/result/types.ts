import type { Slot } from '@/utils/types'
import type { VNode } from 'vue'

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 403 | 404 | 500 | '403' | '404' | '500'
export type ResultContent = string | number | VNode | (() => VNode)

export interface ResultProps {
  /** Result status, decides icon and color */
  status?: ResultStatus
  /** Title content */
  title?: ResultContent
  /** Subtitle content */
  subTitle?: ResultContent
  /** Custom icon */
  icon?: VNode | (() => VNode)
  /** Extra action area */
  extra?: ResultContent
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
