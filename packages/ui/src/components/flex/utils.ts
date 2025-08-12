import classNames from '../../utils/classNames'

import type { FlexProps } from './meta'

export const flexWrapValues = ['wrap', 'nowrap', 'wrap-reverse'] as const

export const justifyContentValues = [
  'flex-start',
  'flex-end',
  'start',
  'end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
  'normal',
  'left',
  'right',
] as const

export const alignItemsValues = [
  'center',
  'start',
  'end',
  'flex-start',
  'flex-end',
  'self-start',
  'self-end',
  'baseline',
  'normal',
  'stretch',
] as const

const genClsWrap = (prefixCls: string, props: FlexProps) => {
  const wrapCls: Record<PropertyKey, boolean> = {}
  flexWrapValues.forEach(cssKey => {
    // Handle both boolean attribute (wrap="wrap") and string value (wrap="wrap")
    const isMatch = props.wrap === true && cssKey === 'wrap' || props.wrap === cssKey
    wrapCls[`${prefixCls}-wrap-${cssKey}`] = isMatch
  })
  return wrapCls
}

const genClsAlign = (prefixCls: string, props: FlexProps) => {
  const alignCls: Record<PropertyKey, boolean> = {}
  alignItemsValues.forEach(cssKey => {
    alignCls[`${prefixCls}-align-${cssKey}`] = props.align === cssKey
  })
  alignCls[`${prefixCls}-align-stretch`] = !props.align && !!props.vertical
  return alignCls
}

const genClsJustify = (prefixCls: string, props: FlexProps) => {
  const justifyCls: Record<PropertyKey, boolean> = {}
  justifyContentValues.forEach(cssKey => {
    justifyCls[`${prefixCls}-justify-${cssKey}`] = props.justify === cssKey
  })
  return justifyCls
}

function createFlexClassNames(prefixCls: string, props: FlexProps) {
  return classNames({
    ...genClsWrap(prefixCls, props),
    ...genClsAlign(prefixCls, props),
    ...genClsJustify(prefixCls, props),
  })
}

export default createFlexClassNames
