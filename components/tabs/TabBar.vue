<template>
  <button :class="classes" :disabled="disabled"
    @click="handleClick" @mouseout="mouseout" @mouseover="mouseover">
    {{tab}}
  </button>
</template>
<script>

export default {
  name: 'TabBar',
  props: {
    prefixCls: {
      default: 'ant-tabs',
      type: String,
    },
    tabBarPosition: {
      default: 'top',
      validator (value) {
        return ['top', 'bottom'].includes(value)
      },
    },
    disabled: Boolean,
    onKeyDown: Function,
    onTabClick: Function,
    activeKey: String,
    tab: String,
  },
  data () {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm',
      },
      clicked: false,
    }
  },
  computed: {
    classes () {
      const { prefixCls, type, shape, size, loading, ghost, clicked, sizeMap } = this
      const sizeCls = sizeMap[size] || ''
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${shape}`]: shape,
        [`${prefixCls}-${sizeCls}`]: sizeCls,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-clicked`]: clicked,
        [`${prefixCls}-background-ghost`]: ghost || type === 'ghost',
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
    mouseover (event) {
      this.$emit('mouseover', event)
    },
    mouseout (event) {
      this.$emit('mouseout', event)
    },
  },
  beforeDestroy () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
}
</script>
