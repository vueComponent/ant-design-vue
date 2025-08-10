export type ButtonProps = {
  /**
   * Specifies the visual style variant of the button
   * @default 'primary'
   */
  variant?: 'solid' | 'outlined' | 'text' | 'link' | 'dashed' | 'filled'
  /**
   * Specifies the size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Specifies the shape of the button
   * @default 'default'
   */
  shape?: 'default' | 'circle' | 'round'
  /**
   * Specifies the loading state of the button
   * @default false
   */
  loading?: boolean
  /**
   * Specifies the disabled state of the button
   * @default false
   */
  disabled?: boolean
  /**
   * Specifies the danger state of the button
   * @default false
   */
  danger?: boolean
  /**
   * Specifies the color of the button
   */
  color?: string
  /**
   * Specifies the href of the button
   */
  href?: string
  /**
   * Specifies the target of the button
   */
  target?: string
}

export const buttonDefaultProps = {
  variant: 'solid',
  size: 'md',
  shape: 'default',
  loading: false,
  disabled: false,
} as const

export type ButtonEmits = {
  /**
   * Triggered when the button is clicked by the user
   * @param e - The native MouseEvent object
   */
  (e: 'click', event: MouseEvent): void
}

export type ButtonSlots = {
  /**
   * Main content slot for the button text or custom content
   */
  default?: (_: any) => any
  /**
   * Slot for the button icon
   */
  icon?: (_: any) => any
  /**
   * Slot for the button loading indicator
   */
  loading?: (_: any) => any
}
