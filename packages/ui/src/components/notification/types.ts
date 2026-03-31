import type { VNode, CSSProperties } from 'vue'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type NotificationPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'

export interface NotificationArgsProps {
  /** Notification title */
  message: string | VNode | (() => VNode)
  /** Notification body */
  description?: string | VNode | (() => VNode)
  /** Notification type */
  type?: NotificationType
  /** Custom icon */
  icon?: VNode | (() => VNode)
  /** Custom close icon */
  closeIcon?: VNode | (() => VNode)
  /** Action button(s) */
  btn?: VNode | (() => VNode)
  /** Duration in seconds (null = never auto-close) */
  duration?: number | null
  /** Callback when closed */
  onClose?: () => void
  /** Callback when clicked */
  onClick?: () => void
  /** Placement position */
  placement?: NotificationPlacement
  /** Distance from top of viewport for first mounted container */
  top?: number | string
  /** Distance from bottom of viewport for first mounted container */
  bottom?: number | string
  /** Container function for first mounted container */
  getContainer?: () => HTMLElement
  /** Custom style */
  style?: CSSProperties
  /** Custom class */
  class?: string
  /** Unique key for update/close */
  key?: string
}

export interface NotificationConfigProps {
  /** Distance from top of viewport */
  top?: number | string
  /** Distance from bottom of viewport */
  bottom?: number | string
  /** Default duration in seconds */
  duration?: number
  /** Default placement */
  placement?: NotificationPlacement
  /** Container function */
  getContainer?: () => HTMLElement
  /** Custom close icon */
  closeIcon?: VNode | (() => VNode)
  /** RTL mode */
  rtl?: boolean
  /** Max number of notifications */
  maxCount?: number
}

export interface NotificationInstance {
  success: (args: NotificationArgsProps) => void
  info: (args: NotificationArgsProps) => void
  warning: (args: NotificationArgsProps) => void
  warn: (args: NotificationArgsProps) => void
  error: (args: NotificationArgsProps) => void
  open: (args: NotificationArgsProps) => void
  close: (key: string) => void
  destroy: () => void
  config: (options: NotificationConfigProps) => void
}

export interface InternalNotificationItem {
  id: string
  args: NotificationArgsProps
  updateMark: number
}
