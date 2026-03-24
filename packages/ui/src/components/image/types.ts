import type { Slot } from '@/utils/types'
import type { CSSProperties, InjectionKey } from 'vue'

export interface ImagePreviewConfig {
  /** Whether preview is visible (v-model:open for controlled) */
  open?: boolean
  /** Container for preview */
  getContainer?: () => HTMLElement
  /** Mask class */
  maskClassName?: string
}

export interface ImageProps {
  /** Image source URL */
  src?: string
  /** Image alt text */
  alt?: string
  /** Image width */
  width?: number | string
  /** Image height */
  height?: number | string
  /** Fallback image URL on error */
  fallback?: string
  /** Preview configuration (false to disable) */
  preview?: boolean | ImagePreviewConfig
  /** Whether image is loading (shows placeholder) */
  placeholder?: boolean
  /** Wrapper class name */
  wrapperClassName?: string
  /** Wrapper style */
  wrapperStyle?: CSSProperties
}

export const imageDefaultProps = {
  preview: true,
}

export interface ImageEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'error', event: Event): void
}

export interface ImageSlots {
  placeholder?: Slot
  previewMask?: Slot
}

// Preview Group
export interface ImagePreviewGroupProps {
  /** Preview configuration */
  preview?: boolean | ImagePreviewConfig
}

export interface ImagePreviewGroupSlots {
  default?: Slot
}

// Internal preview context
export interface ImagePreviewContext {
  register: (id: string, src: string) => void
  unregister: (id: string) => void
  preview: (id: string) => void
  isInGroup: boolean
}

export const IMAGE_GROUP_KEY = Symbol('imageGroup') as InjectionKey<ImagePreviewContext>
