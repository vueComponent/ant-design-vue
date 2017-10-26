<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script>

export default {
  name: 'ButtonGroup',
  props: {
    prefixCls: {
      default: 'ant-btn-group',
      type: String,
    },
    size: {
      validator (value) {
        return ['small', 'large', 'default'].includes(value)
      },
    },
  },
  data () {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
    }
  },
  computed: {
    classes () {
      const { prefixCls, size, sizeMap } = this
      const sizeCls = sizeMap[size] || ''
      return [
        {
          [`${prefixCls}`]: true,
          [`${prefixCls}-${sizeCls}`]: sizeCls,
        },
      ]
    },
  },
}
</script>
