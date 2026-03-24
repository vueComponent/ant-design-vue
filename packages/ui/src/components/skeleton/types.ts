import type { Slot } from '@/utils/types'

export interface SkeletonAvatarProps {
  /** Avatar size */
  size?: 'small' | 'default' | 'large' | number
  /** Avatar shape */
  shape?: 'circle' | 'square'
  /** Show active animation */
  active?: boolean
}

export interface SkeletonTitleProps {
  /** Width of title row */
  width?: string | number
}

export interface SkeletonParagraphProps {
  /** Number of paragraph rows */
  rows?: number
  /** Width of paragraph rows (can be array for each row or single value for last row) */
  width?: string | number | Array<string | number>
}

export interface SkeletonProps {
  /** Show active animation */
  active?: boolean
  /** Show skeleton when loading (true = show skeleton, false = show children) */
  loading?: boolean
  /** Show avatar placeholder */
  avatar?: boolean | SkeletonAvatarProps
  /** Show title placeholder */
  title?: boolean | SkeletonTitleProps
  /** Show paragraph placeholder */
  paragraph?: boolean | SkeletonParagraphProps
  /** Rounded skeleton elements */
  round?: boolean
}

export const skeletonDefaultProps = {
  loading: true,
  avatar: false,
  title: true,
  paragraph: true,
  active: false,
  round: false,
}

// Sub-component prop types for standalone elements
export interface SkeletonButtonProps {
  size?: 'small' | 'default' | 'large'
  shape?: 'default' | 'circle' | 'round' | 'square'
  block?: boolean
  active?: boolean
}

export interface SkeletonInputProps {
  size?: 'small' | 'default' | 'large'
  block?: boolean
  active?: boolean
}

export interface SkeletonImageProps {
  active?: boolean
}

export interface SkeletonSlots {
  default?: Slot
}
