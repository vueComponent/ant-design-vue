import { PropType, ExtractPublicPropTypes } from 'vue'

// Button Props
export const buttonProps = {
  /**
   * Specifies the visual style variant of the button
   * @default 'primary'
   */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'text' | 'link' | 'dashed' | 'filled'>,
    default: 'solid',
  },

  /**
   * Specifies the size of the button
   * @default 'md'
   */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },

  /**
   * Specifies the shape of the button
   * @default 'default'
   */
  shape: {
    type: String as PropType<'default' | 'circle' | 'round'>,
    default: 'default',
  },

  /**
   * Specifies the loading state of the button
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },

  /**
   * Specifies the disabled state of the button
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Specifies the danger state of the button
   * @default false
   */
  danger: {
    type: Boolean,
    default: false,
  },

  /**
   * Specifies the color of the button
   */
  color: {
    type: String,
  },
} as const

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>

// Button Emits
export const buttonEmits = {
  /**
   * Triggered when the button is clicked by the user
   * @param e - The native MouseEvent object
   */
  click: (e: MouseEvent) => e instanceof MouseEvent,
} as const

export type ButtonEmits = typeof buttonEmits

// Button Slots
export const buttonSlots = {
  /**
   * Main content slot for the button text or custom content
   */
  default: (_: any) => null as any,
  /**
   * Slot for the button icon
   */
  icon: (_: any) => null as any,
  /**
   * Slot for the button loading indicator
   */
  loading: (_: any) => null as any,
} as const

export type ButtonSlots = typeof buttonSlots
