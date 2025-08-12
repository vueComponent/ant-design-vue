import { CSSProperties } from "vue"

type SizeType = 'small' | 'middle' | 'large' | undefined

export type FlexProps = {
  prefixCls?: string
  rootClassName?: string
  vertical?: boolean
  wrap?: CSSProperties['flexWrap'] | boolean
  justify?: CSSProperties['justifyContent']
  align?: CSSProperties['alignItems']
  flex?: CSSProperties['flex']
  gap?: CSSProperties['gap'] | SizeType
  componentTag?: any
}

export const flexDefaultProps = {
  prefixCls: 'ant-flex',
  componentTag: 'div',
} as const
