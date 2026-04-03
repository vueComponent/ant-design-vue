import type { CSSProperties } from 'vue'
import type { Slot, SlotReturnType } from '@/utils/types'
import type { ButtonProps } from '../button/types'

export type ModalType = 'info' | 'success' | 'error' | 'warning' | 'confirm'
export type ModalButtonType =
  | NonNullable<ButtonProps['variant']>
  | NonNullable<ButtonProps['type']>
  | 'danger'
export type ModalRenderContent = SlotReturnType | (() => SlotReturnType)

export interface ModalProps {
  /** Whether the modal is visible (v-model:open) */
  open?: boolean
  /** @deprecated Use `open` instead */
  visible?: boolean
  /** Modal title */
  title?: string
  /** Modal width */
  width?: string | number
  /** Whether to center the modal vertically */
  centered?: boolean
  /** Whether to show the close button */
  closable?: boolean
  /** Whether to show the mask overlay */
  mask?: boolean
  /** Whether clicking the mask closes the modal */
  maskClosable?: boolean
  /** Whether pressing ESC closes the modal */
  keyboard?: boolean
  /** Whether to destroy the modal DOM when closed */
  destroyOnClose?: boolean
  /** Whether to force render the modal even when not visible */
  forceRender?: boolean
  /** Whether the OK button shows a loading spinner */
  confirmLoading?: boolean
  /** OK button text */
  okText?: string
  /** Cancel button text */
  cancelText?: string
  /** OK button type */
  okType?: ModalButtonType
  /** OK button props */
  okButtonProps?: Partial<ButtonProps>
  /** Cancel button props */
  cancelButtonProps?: Partial<ButtonProps>
  /** Custom z-index */
  zIndex?: number
  /** Class for the modal wrapper */
  wrapClassName?: string
  /** Style for the modal body */
  bodyStyle?: CSSProperties
  /** Style for the mask */
  maskStyle?: CSSProperties
  /** Function that returns the container element */
  getContainer?: () => HTMLElement
  /** Whether to show the footer (set false to hide) */
  footer?: boolean | null
  /** Callback after close animation finishes */
  afterClose?: () => void
}

export const modalDefaultProps = {
  width: 520,
  closable: true,
  mask: true,
  maskClosable: true,
  keyboard: true,
  destroyOnClose: false,
  forceRender: false,
  confirmLoading: false,
  okText: 'OK',
  cancelText: 'Cancel',
  okType: 'solid' as const,
  centered: false,
} as const

export interface ModalEmits {
  (e: 'update:open', open: boolean): void
  /** @deprecated */
  (e: 'update:visible', open: boolean): void
  (e: 'ok', event: MouseEvent): void
  (e: 'cancel', event: MouseEvent | KeyboardEvent): void
  (e: 'afterClose'): void
}

export interface ModalSlots {
  default?: Slot
  title?: Slot
  footer?: Slot
  closeIcon?: Slot
}

// --- Imperative API types ---

export interface ModalFuncProps {
  type?: ModalType
  title?: ModalRenderContent
  content?: ModalRenderContent
  icon?: ModalRenderContent
  okText?: string
  cancelText?: string
  okType?: ModalButtonType
  okButtonProps?: Partial<ButtonProps>
  cancelButtonProps?: Partial<ButtonProps>
  onOk?: (...args: any[]) => any | Promise<any>
  onCancel?: (...args: any[]) => any | Promise<any>
  afterClose?: () => void
  centered?: boolean
  width?: string | number
  mask?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  zIndex?: number
  bodyStyle?: CSSProperties
  maskStyle?: CSSProperties
  getContainer?: () => HTMLElement
  closable?: boolean
  class?: string
  wrapClassName?: string
  footer?: ModalRenderContent
  closeIcon?: ModalRenderContent
  autoFocusButton?: 'ok' | 'cancel' | null
  okCancel?: boolean
}

export type ModalFuncConfigUpdate =
  | Partial<ModalFuncProps>
  | ((prevConfig: ModalFuncProps) => ModalFuncProps)

export interface ModalFuncReturn {
  destroy: () => void
  update: (newConfig: ModalFuncConfigUpdate) => void
}

export interface ConfirmDialogInstance {
  close: () => void
  update: (newConfig: ModalFuncConfigUpdate) => void
}

export function resolveOkTypeProps(okType?: ModalButtonType): Record<string, unknown> {
  if (!okType) return {}
  if (okType === 'danger') return { danger: true }
  if (okType === 'primary' || okType === 'default') return { type: okType }
  return { variant: okType }
}
