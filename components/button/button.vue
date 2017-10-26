<template>
  <button :type="htmlType" :class="classes" :disabled="disabled"
    @click="handleClick" @mouseout="mouseout" @mouseover="mouseover">
    <Icon v-if="iconType" :type="iconType"></Icon>
    <span v-if="this.$slots.default">
      <slot></slot>
    </span>
  </button>
</template>
<script>
import Icon from '../icon'

export default {
  name: 'Button',
  components: { Icon },
  props: {
    prefixCls: {
      default: 'ant-btn',
      type: String,
    },
    type: {
      validator (value) {
        return ['primary', 'danger', 'dashed', 'ghost', 'default'].includes(value)
      },
    },
    htmlType: {
      default: 'button',
      validator (value) {
        return ['button', 'submit', 'reset'].includes(value)
      },
    },
    icon: String,
    shape: {
      validator (value) {
        return ['circle', 'circle-outline'].includes(value)
      },
    },
    size: {
      validator (value) {
        return ['small', 'large', 'default'].includes(value)
      },
    },
    loading: Boolean,
    disabled: Boolean,
    ghost: Boolean,
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
    iconType () {
      const { loading, icon } = this
      return loading ? 'loading' : icon
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
