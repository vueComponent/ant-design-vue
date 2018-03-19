
import PropTypes from '../_util/vue-types'

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export const ColSize = PropTypes.shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
}).loose

const objectOrNumber = PropTypes.oneOfType([PropTypes.number, ColSize])

export const ColProps = {
  span: objectOrNumber,
  order: objectOrNumber,
  offset: objectOrNumber,
  push: objectOrNumber,
  pull: objectOrNumber,
  xs: PropTypes.oneOfType([PropTypes.number, ColSize]),
  sm: PropTypes.oneOfType([PropTypes.number, ColSize]),
  md: PropTypes.oneOfType([PropTypes.number, ColSize]),
  lg: PropTypes.oneOfType([PropTypes.number, ColSize]),
  xl: PropTypes.oneOfType([PropTypes.number, ColSize]),
  xxl: PropTypes.oneOfType([PropTypes.number, ColSize]),
  prefixCls: PropTypes.string,
}

export default {
  props: ColProps,
  name: 'Col',
  render () {
    const { span, order, offset, push, pull, prefixCls = 'ant-col', $slots, $attrs, $listeners } = this
    let sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
      let sizeProps = {}
      if (typeof this[size] === 'number') {
        sizeProps.span = this[size]
      } else if (typeof this[size] === 'object') {
        sizeProps = this[size] || {}
      }

      sizeClassObj = {
        ...sizeClassObj,
        [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
        [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
        [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
        [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
        [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0,
      }
    })
    const classes = {
      [`${prefixCls}-${span}`]: span !== undefined,
      [`${prefixCls}-order-${order}`]: order,
      [`${prefixCls}-offset-${offset}`]: offset,
      [`${prefixCls}-push-${push}`]: push,
      [`${prefixCls}-pull-${pull}`]: pull,
      ...sizeClassObj,
    }
    const divProps = {
      on: $listeners,
      attrs: $attrs,
      class: classes,
    }
    return <div {...divProps}>{$slots.default}</div>
  },
}

