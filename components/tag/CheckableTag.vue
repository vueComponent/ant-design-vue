<template>
  <div :class="classes" @click="handleClick">
    <slot />
  </div>
</template>
<script>

export default {
  name: 'CheckableTag',
  model: {
    prop: 'checked',
  },
  props: {
    prefixCls: {
      default: 'ant-tag',
      type: String,
    },
    checked: Boolean,
  },
  computed: {
    classes () {
      const { prefixCls, checked } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checkable`]: true,
        [`${prefixCls}-checkable-checked`]: checked,
      }
    },
  },
  methods: {
    handleClick () {
      const { checked } = this
      this.$emit('input', !checked)
      this.$emit('change', !checked)
    },
  },
}
</script>
