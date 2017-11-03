<template>
  <label :class="classes">
    <span :class="checkboxClass">
      <input :name="name" type="checkbox" :disabled="disabled"
        :class="`${prefixCls}-input`" :checked="stateChecked"
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
    defaultChecked: Boolean,
    checked: { type: Boolean, default: undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: [String, Number, Boolean],
    name: String,
    indeterminate: Boolean,
    onGroupChange: Function,
  },
  model: {
    prop: 'checked',
  },
  data () {
    const { checked, defaultChecked } = this
    return {
      stateChecked: checked === undefined ? defaultChecked : checked,
    }
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
      const { prefixCls, indeterminate, stateChecked, disabled } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-checked`]: stateChecked,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-indeterminate`]: indeterminate,
      }
    },
  },
  mounted () {
  },
  methods: {
    handleChange (event) {
      const targetChecked = event.target.checked
      this.$emit('input', targetChecked)
      const { name, value, checked } = this
      if (checked === undefined) {
        this.stateChecked = targetChecked
      }
      const target = {
        name,
        value,
        checked: targetChecked,
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
  watch: {
    checked (val) {
      this.stateChecked = val
    },
  },
}
</script>
