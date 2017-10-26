<template>
  <i :title="title" :class="classes"
    @click="handleClick">
  </i>
</template>
<script>
export default {
  name: 'Icon',
  props: {
    prefixCls: {
      default: 'anticon',
      type: String,
    },
    type: String,
    title: String,
    spin: Boolean,
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      const { prefixCls, type, spin } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-spin`]: !!spin || type === 'loading',
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
