import { PropType, ExtractPublicPropTypes } from 'vue'

// Button Props
export const buttonProps = {
  /**
   * Specifies the visual style variant of the button
   * @default 'primary'
   */
  type: {
    type: String as PropType<'primary' | 'secondary'>,
    default: 'primary',
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
} as const

export type ButtonSlots = typeof buttonSlots
