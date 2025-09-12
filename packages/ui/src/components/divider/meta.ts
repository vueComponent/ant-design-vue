type SizeType = 'small' | 'middle' | 'large' | undefined

export type DividerProps = {
  prefixCls?: string
  type?: 'horizontal' | 'vertical'
  /**
   * @default center
   */
  orientation?:
    | 'left'
    | 'right'
    | 'center'
    | 'start' // 👈 5.24.0+
    | 'end' // 👈 5.24.0+
  orientationMargin?: string | number
  rootClassName?: string
  dashed?: boolean
  /**
   * @since 5.20.0
   * @default solid
   */
  variant?: 'dashed' | 'dotted' | 'solid'
  size?: SizeType
  plain?: boolean
}

export const DividerDefaultProps = {
  prefixCls: 'ant-divider',
  type: 'horizontal',
  orientation: 'center',
  variant: 'solid',
} as const

export type DividerSlots = {
  default: any
}
