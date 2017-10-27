<template>
  <div :class="classes" :style="modifiedStyle">
    <slot  />
  </div>
</template>
<script>
  export default {
    name: 'Row',
    props: {
      prefixCls: {
        'default': 'ant-row',
        type: String,
      },
      type: {
        validator (value) {
          //  flex can't work before IE11
          if (document.all && document.compatMode) {
            console.error('you cannot use flex in the old browser')
            return false
          }
          return ['flex', ''].includes(value)
        },
      },
      gutter: {
        'default': 0,
        validator: k => k >= 0,
      },
      align: {
        'default': 'top',
        validator (value) {
          return ['top', 'middle', 'bottom'].includes(value)
        },
      },
      justify: {
        'default': 'start',
        validator (value) {
          return ['start', 'end', 'center', 'space-around', 'space-between'].includes(value)
        },
      },
    },
    data () {
      const half = this.gutter / 2
      return {
        modifiedStyle: {
          'margin-left': -half + 'px',
          'margin-right': -half + 'px',
        },
      }
    },
    computed: {
      classes () {
        const { prefixCls, type, align, justify } = this
        return {
          [`${prefixCls}`]: true,
          [`${prefixCls}-${type}`]: type,
          [`${prefixCls}-${type}-${justify}`]: type && justify,
          [`${prefixCls}-${type}-${align}`]: type && align,
        }
      },
    },
    methods: {
      handleClick (event) {
        if (this.clicked) {
          return
        }
        this.clicked = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => (this.clicked = false), 500)
        this.$emit('click', event)
      },
    },
    beforeDestroy () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
  }
</script>

