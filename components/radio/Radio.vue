<template>
  <label :class="classes">
    <span :class="checkboxClass">
      <input :name="name" type="radio" :disabled="disabled"
        :class="`${prefixCls}-input`" :checked="!!checked"
        @change="handleChange"
        />
      <span :class="`${prefixCls}-inner`" />
    </span>
    <span v-if="hasDefaultSlot">
      <slot></slot>
    </span>
  </label>
</template>
<script>
export default {
  name: 'Radio',
  props: {
    prefixCls: {
      default: 'ant-radio',
      type: String,
    },
    checked: Boolean,
    disabled: Boolean,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    onGroupChange: Function,
  },
  model: {
    prop: 'checked',
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    },
    classes () {
      const { prefixCls, disabled, checked } = this
      return {
        [`${prefixCls}-wrapper`]: true,
        [`${prefixCls}-wrapper-checked`]: checked,
        [`${prefixCls}-wrapper-disabled`]: disabled,
      }
    },
    checkboxClass () {
      const { prefixCls, disabled, checked } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: checked,
        [`${prefixCls}-disabled`]: disabled,
      }
    },
  },
  methods: {
    handleChange (event) {
      const { name, value } = this
      this.$emit('input', true)
      const target = {
        name,
        value,
        checked: true,
      }
      this.$emit('change', {
        target,
        stopPropagation () {
          event.stopPropagation()
        },
        preventDefault () {
          event.preventDefault()
        },
      })
      if (this.isGroup) {
        this.onGroupChange({ target })
      }
    },
  },
}
</script>
