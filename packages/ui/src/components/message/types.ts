import type { VNode, CSSProperties } from 'vue'
import type { Slot } from '@/utils/types'

export type MessageType = 'info' | 'success' | 'error' | 'warning' | 'loading'
export type MessageContent = string | VNode | (() => VNode)

export interface MessageArgsProps {
  /** Message content */
  content: MessageContent
  /** Message type */
  type?: MessageType
  /** Duration in seconds (0 = never auto-close) */
  duration?: number
  /** Callback when message closes */
  onClose?: () => void
  /** Click callback */
  onClick?: (e: MouseEvent) => void
  /** Custom icon */
  icon?: VNode | (() => VNode)
  /** Unique key for update/destroy */
  key?: string | number
  /** Custom style */
  style?: CSSProperties
  /** Custom class */
  class?: string
}

export interface MessageConfigOptions {
  /** Distance from top of viewport */
  top?: number | string
  /** Default duration in seconds */
  duration?: number
  /** Max number of messages */
  maxCount?: number
  /** Container function */
  getContainer?: () => HTMLElement
  /** RTL mode */
  rtl?: boolean
}

export interface MessageInstance {
  info: MessageFn
  success: MessageFn
  error: MessageFn
  warning: MessageFn
  warn: MessageFn
  loading: MessageFn
  open: (args: MessageArgsProps) => MessageReturn
  destroy: (key?: string | number) => void
  config: (options: MessageConfigOptions) => void
  useMessage: () => readonly [MessageInstance, () => VNode | null]
}

export type MessageFn = {
  (content: MessageContent, duration?: number, onClose?: () => void): MessageReturn
  (args: MessageArgsProps): MessageReturn
}

export interface MessageReturn {
  (): void // call to destroy
  then: <TResult1 = void, TResult2 = never>(
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>
}

export interface InternalMessageItem {
  id: string
  args: MessageArgsProps
}

export interface MessageSlots {
  default?: Slot
}
