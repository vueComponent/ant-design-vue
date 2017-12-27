<script>
import TextArea from './TextArea'
import omit from 'omit.js'
import inputProps from './inputProps'
import hasProp from '../_util/hasProp'

function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

export default {
  name: 'Input',
  props: {
    ...inputProps,
  },
  model: {
    prop: 'value',
    event: 'change.value',
  },
  data () {
    const { value, defaultValue } = this.$props
    return {
      stateValue: fixControlledValue(!hasProp(this, 'value') ? defaultValue : value),
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
        this.$emit('pressEnter', e)
      }
      this.$emit('keydown', e)
    },
    handleChange (e) {
      if (!hasProp(this, 'value')) {
        this.stateValue = e.target.value
      } else {
        this.$forceUpdate()
      }
      this.$emit('change.value', e.target.value)
      this.$emit('change', e)
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

    renderInput () {
      const otherProps = omit(this.$props, [
        'prefixCls',
      ])
      const { stateValue, getInputClassName, handleKeyDown, handleChange } = this
      const attrs = {
        attrs: { ...otherProps, ...this.$attrs },
      }
      return this.renderLabeledIcon(
        <input
          {...attrs}
          value={stateValue}
          class={getInputClassName()}
          onKeydown={handleKeyDown}
          onInput={handleChange}
          ref='input'
        />,
      )
    },
  },
  render () {
    if (this.$props.type === 'textarea') {
      const self = this
      const textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: {
          change (e) {
            self.handleChange(e)
          },
          keydown (e) {
            self.handleKeyDown(e)
          },
        },
      }
      return <TextArea {...textareaProps} ref='input' />
    }
    return this.renderLabeledInput(this.renderInput())
  },
}
</script>
