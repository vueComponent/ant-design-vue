<script>
import omit from 'omit.js'
// import TextArea from './TextArea';

import inputProps from './inputProps'

function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

let inputKey = 1

export default {
  name: 'Input',
  props: {
    ...inputProps,
  },
  data () {
    const { value, defaultValue } = this.$props
    return {
      stateValue: fixControlledValue(value === undefined ? defaultValue : value),
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      this.stateValue = fixControlledValue(val)
    },
  },
  methods: {
    handleKeyDown (e) {
      if (e.keyCode === 13) {
        this.$emit('press-enter', e)
      }
      this.$emit('keydown', e)
    },
    handleChange (e) {
      const { value } = this.$props
      if (value === undefined) {
        this.stateValue = e.target.value
      } else {
        this.$forceUpdate()
        this.$emit('input', e)
        this.$emit('change', e.target.value)
      }
    },

    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },

    getInputClassName () {
      const { prefixCls, size, disabled } = this.$props
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-disabled`]: disabled,
      }
    },
    renderLabeledInput (children) {
      const props = this.props
      let { addonBefore, addonAfter } = this.$slots
      // Not wrap when there is not addons
      if ((!addonBefore && !addonAfter)) {
        return children
      }

      const wrapperClassName = `${props.prefixCls}-group`
      const addonClassName = `${wrapperClassName}-addon`
      addonBefore = addonBefore ? (
        <span class={addonClassName}>
          {addonBefore}
        </span>
      ) : null

      addonAfter = addonAfter ? (
        <span class={addonClassName}>
          {addonAfter}
        </span>
      ) : null

      const className = {
        [`${props.prefixCls}-wrapper`]: true,
        [wrapperClassName]: (addonBefore || addonAfter),
      }

      if (addonBefore || addonAfter) {
        return (
          <span
            class={`${props.prefixCls}-group-wrapper`}
          >
            <span class={className}>
              {addonBefore}
              {children}
              {addonAfter}
            </span>
          </span>
        )
      }
      return (
        <span class={className}>
          {addonBefore}
          {children}
          {addonAfter}
        </span>
      )
    },
    renderLabeledIcon (children) {
      const { prefixCls } = this.$props
      let { prefix, suffix } = this.$slots
      if (!prefix && !suffix) {
        return children
      }

      prefix = prefix ? (
        <span class={`${prefixCls}-prefix`}>
          {prefix}
        </span>
      ) : null

      suffix = suffix ? (
        <span class={`${prefixCls}-suffix`}>
          {suffix}
        </span>
      ) : null

      return (
        <span
          class={`${prefixCls}-affix-wrapper`}
        >
          {prefix}
          {children}
          {suffix}
        </span>
      )
    },
    getInputKey () {
      const { value } = this
      // 模拟受控组件
      if (value !== undefined) {
        return inputKey++
      } else {
        return inputKey
      }
    },

    renderInput () {
      const { placeholder, type, readOnly = false, name, id, disabled = false } = this.$props
      const { getInputKey, stateValue, getInputClassName, handleKeyDown, handleChange } = this
      return this.renderLabeledIcon(
        <input
          value={stateValue}
          type={type}
          readOnly={readOnly}
          placeholder={placeholder}
          name={name}
          id={id}
          disabled={disabled}
          class={getInputClassName()}
          onKeydown={handleKeyDown}
          onInput={handleChange}
          ref='input'
          key={getInputKey()}
        />,
      )
    },
  },
  render () {
    return this.renderLabeledInput(this.renderInput())
  },
}
</script>
