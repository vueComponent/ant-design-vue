import type { Slot } from '@/utils/types'

export interface WatermarkFont {
  color?: string
  fontSize?: number
  fontWeight?: 'normal' | 'light' | 'bold' | number
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  fontFamily?: string
}

export interface WatermarkProps {
  /** Z-index of the watermark */
  zIndex?: number
  /** Rotation angle in degrees */
  rotate?: number
  /** Width of a single watermark */
  width?: number
  /** Height of a single watermark */
  height?: number
  /** Image URL for image watermark (takes priority over content) */
  image?: string
  /** Text content of the watermark */
  content?: string | string[]
  /** Font configuration */
  font?: WatermarkFont
  /** Gap between watermarks [horizontal, vertical] */
  gap?: [number, number]
  /** Offset from top-left [x, y] */
  offset?: [number, number]
}

export const watermarkDefaultProps = {
  zIndex: 9,
  rotate: -22,
  gap: () => [100, 100] as [number, number],
} as const

export interface WatermarkSlots {
  default?: Slot
}
