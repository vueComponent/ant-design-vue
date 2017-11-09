<script>
  //  Equal or Larger Than 0
  function elt0 (value) {
    return value >= 0
  }
  //  equal to 0(default) or more
  const DEFAULT_0_OR_MORE = {
    'default': 0,
    validator: elt0,
  }

  export default {
    name: 'Ant-Col',
    props: {
      prefixCls: {
        'default': 'ant-col',
        type: String,
      },
      span: Number,
      order: DEFAULT_0_OR_MORE,
      offset: DEFAULT_0_OR_MORE,
      push: DEFAULT_0_OR_MORE,
      pull: DEFAULT_0_OR_MORE,
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object],
      xl: [Number, Object],
    },
    inject: {
      parentRow: { 'default': undefined },
    },
    computed: {
      classes () {
        const { prefixCls, span, order, offset, push, pull } = this
        let sizeClassObj = {};
        ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
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
        return {
          [`${prefixCls}`]: true,
          [`${prefixCls}-${span}`]: span !== undefined,
          [`${prefixCls}-order-${order}`]: order,
          [`${prefixCls}-offset-${offset}`]: offset,
          [`${prefixCls}-push-${push}`]: push,
          [`${prefixCls}-pull-${pull}`]: pull,
          ...sizeClassObj,
        }
      },
      gutter () {
        const parent = this.parentRow
        return parent ? +parent.gutter : 0
      },
    },
    render (h) {
      const style = {}
      if (this.gutter) {
        style.paddingLeft = this.gutter / 2 + 'px'
        style.paddingRight = style.paddingLeft
      }
      // why only unnamed slots
      return h('div', {
        'class': this.classes,
        style,
      }, this.$slots['default'])
    },
  }
</script>

