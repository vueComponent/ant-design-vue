<template>
  <label :class="classes">
    <span :class="checkboxClass">
      <input :name="name" type="checkbox" :disabled="disabled"
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
  name: 'Checkbox',
  props: {
    prefixCls: {
      default: 'ant-checkbox',
      type: String,
    },
    checked: Boolean,
    disabled: Boolean,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    indeterminate: Boolean,
    onGroupChange: Function,
  },
  data () {
    return {
    }
  },
  model: {
    prop: 'checked',
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    },
    classes () {
      const { prefixCls } = this
      return {
        [`${prefixCls}-wrapper`]: true,
      }
    },
    checkboxClass () {
      const { prefixCls, indeterminate, checked, disabled } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: checked,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-indeterminate`]: indeterminate,
      }
    },
  },
  mounted () {
  },
  methods: {
    handleChange (event) {
      if (this.disabled) {
        return false
      }
      const checked = event.target.checked
      this.$emit('input', checked)
      const { name, value } = this
      const target = {
        name,
        value,
        checked,
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
