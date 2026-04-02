import { Fragment, type InjectionKey, type VNode } from 'vue'
import type { Slot } from '@/utils/types'
import type { SizeType } from '../config-provider/types'

export type { SizeType }

export type SpaceSizePreset = 'small' | 'middle' | 'large'
export type SpaceSize = SpaceSizePreset | number

export interface SpaceProps {
  /** Size of spacing: preset name, number (px), or [horizontal, vertical] */
  size?: SpaceSize | [SpaceSize, SpaceSize]
  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
  /** Alignment of items */
  align?: 'start' | 'end' | 'center' | 'baseline'
  /** Enable wrapping */
  wrap?: boolean
}

export const spaceDefaultProps = {
  direction: 'horizontal',
} as const

export interface SpaceSlots {
  default?: Slot
  split?: Slot
}

export interface SpaceCompactProps {
  /** Size of compact items */
  size?: SizeType
  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
  /** Alignment of items */
  align?: 'start' | 'end' | 'center' | 'baseline'
  /** Full-width block display */
  block?: boolean
}

export const spaceCompactDefaultProps = {
  direction: 'horizontal',
  size: 'md',
} as const

export const SPACE_SIZE_MAP: Record<SpaceSizePreset, number> = {
  small: 8,
  middle: 16,
  large: 24,
}

// Map ConfigProvider size (sm/md/lg) to Space size (small/middle/large)
export const GLOBAL_SIZE_MAP: Record<string, SpaceSizePreset> = {
  sm: 'small',
  md: 'middle',
  lg: 'large',
}

/**
 * SpaceCompactItem context - injected into each child component
 * Used by Button, Input, Select etc. to adjust their styles when inside SpaceCompact
 */
export interface SpaceCompactItemContext {
  compactSize?: SizeType
  compactDirection?: 'horizontal' | 'vertical'
  isFirstItem: boolean
  isLastItem: boolean
}

export const spaceCompactItemContextKey = Symbol('spaceCompactItem') as InjectionKey<SpaceCompactItemContext>

/**
 * Context key to detect if inside a SpaceCompact
 * Used for nested SpaceCompact detection
 */
export const spaceCompactContextKey = Symbol('spaceCompactContext') as InjectionKey<true>

/**
 * Filter empty children (null, undefined, empty strings, booleans)
 * Matches the behavior of the original ant-design-vue filterEmpty
 * Also flattens Fragment children
 */
export function filterEmpty(children: VNode[] | undefined): VNode[] {
  if (!children) return []
  const result: VNode[] = []

  for (const child of children) {
    // Skip comments
    if (child.type === Comment) continue

    // Skip empty text nodes
    if (child.type === Text && typeof child.children === 'string') {
      if (child.children.trim() !== '') {
        result.push(child)
      }
      continue
    }

    // Skip undefined/null
    if (child.type === undefined) continue

    // Flatten Fragment children
    if (child.type === Fragment) {
      const fragmentChildren = child.children as VNode[]
      if (Array.isArray(fragmentChildren)) {
        result.push(...filterEmpty(fragmentChildren))
      }
      continue
    }

    result.push(child)
  }

  return result
}
