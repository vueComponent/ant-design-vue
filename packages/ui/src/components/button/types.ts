import type { Component, InjectionKey, ComputedRef } from 'vue'
import type { Slot } from '@/utils/types'

export type ButtonVariant = 'solid' | 'outlined' | 'text' | 'link' | 'dashed' | 'filled'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'default' | 'circle' | 'round'
export type ButtonHTMLType = 'submit' | 'button' | 'reset'

/** @deprecated Use `variant` instead */
export type ButtonLegacyType = 'primary' | 'default' | 'dashed' | 'text' | 'link' | 'ghost'
/** @deprecated Use 'sm' | 'md' | 'lg' instead */
export type ButtonLegacySize = 'small' | 'middle' | 'large'

export interface ButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant
  /** @deprecated Use `variant` instead. Maps: primary→solid, default→outlined, dashed→dashed, text→text, link→link */
  type?: ButtonLegacyType
  /** Button size */
  size?: ButtonSize | ButtonLegacySize
  /** Button shape */
  shape?: ButtonShape
  /** Show loading spinner. Pass `{ delay: ms }` to delay the loading state */
  loading?: boolean | { delay?: number }
  /** Disabled state */
  disabled?: boolean
  /** Danger style */
  danger?: boolean
  /** Ghost style — transparent background */
  ghost?: boolean
  /** Full-width block button */
  block?: boolean
  /** Custom color — overrides theme primary color */
  color?: string
  /** If set, renders as `<a>` tag */
  href?: string
  /** Target for `<a>` tag */
  target?: string
  /** HTML button type attribute */
  htmlType?: ButtonHTMLType
  /** Icon component (VNode). Alternatively use #icon slot */
  icon?: Component
  /** Title attribute */
  title?: string
}

export const buttonDefaultProps = {
  shape: 'default',
  disabled: false,
  danger: false,
  ghost: false,
  block: false,
  htmlType: 'button',
} as const

export interface ButtonEmits {
  /** Explicitly emitted to gate loading/disabled state — not a passthrough of the native event */
  (e: 'click', event: MouseEvent): void
}

export interface ButtonSlots {
  default?: Slot
  icon?: Slot
}

// --- Legacy mapping helpers ---

const TYPE_VARIANT_MAP: Record<string, ButtonVariant> = {
  primary: 'solid',
  default: 'outlined',
  dashed: 'dashed',
  text: 'text',
  link: 'link',
}

const SIZE_MAP: Record<string, ButtonSize> = {
  small: 'sm',
  middle: 'md',
  default: 'md',
  large: 'lg',
}

export function resolveVariant(props: ButtonProps): ButtonVariant {
  if (props.variant) return props.variant
  if (props.type) {
    if (process.env.NODE_ENV !== 'production') {
      const mapped = TYPE_VARIANT_MAP[props.type]
      if (!mapped) {
        console.warn(
          `[antdv] Button: unknown type "${props.type}". Use \`variant\` prop instead.`,
        )
      } else {
        console.warn(
          `[antdv] Button: \`type="${props.type}"\` is deprecated. Use \`variant="${mapped}"\` instead.`,
        )
      }
    }
    return TYPE_VARIANT_MAP[props.type] ?? 'solid'
  }
  return 'outlined'
}

export function resolveSize(size: ButtonProps['size'] | undefined): ButtonSize {
  if (!size) return 'md'
  return SIZE_MAP[size] ?? (size as ButtonSize)
}

// --- ButtonGroup ---

export interface ButtonGroupContext {
  size: ComputedRef<ButtonSize | undefined>
}

export const BUTTON_GROUP_KEY: InjectionKey<ButtonGroupContext> = Symbol('AButtonGroup')

export interface ButtonGroupProps {
  size?: ButtonSize | ButtonLegacySize
}
