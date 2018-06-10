
import omit from 'omit.js'
import inputProps from './inputProps'
import calculateNodeHeight from './calculateNodeHeight'
import hasProp from '../_util/props-util'

function onNextFrame (cb) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb)
  }
  return window.setTimeout(cb, 1)
}

function clearNextFrameAction (nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId)
  } else {
    window.clearTimeout(nextFrameId)
  }
}
function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

export default {
  name: 'ATextarea',
  props: {
    ...inputProps,
    autosize: [Object, Boolean],
  },
  model: {
    prop: 'value',
    event: 'change.value',
  },
  data () {
    const { value, defaultValue } = this.$props
    return {
      stateValue: fixControlledValue(!hasProp(this, 'value') ? defaultValue : value),
      nextFrameActionId: undefined,
      textareaStyles: {},
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      this.stateValue = fixControlledValue(val)
      if (this.nextFrameActionId) {
        clearNextFrameAction(this.nextFrameActionId)
      }
      this.nextFrameActionId = onNextFrame(this.resizeTextarea)
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.resizeTextarea()
      if (this.autoFocus) {
        this.focus()
      }
    })
  },
  methods: {
    handleKeyDown (e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e)
      }
      this.$emit('keydown', e)
    },
    resizeTextarea () {
      const { autosize } = this.$props
      if (!autosize || !this.$refs.textArea) {
        return
      }
      const minRows = autosize ? autosize.minRows : null
      const maxRows = autosize ? autosize.maxRows : null
      const textareaStyles = calculateNodeHeight(this.$refs.textArea, false, minRows, maxRows)
      this.textareaStyles = textareaStyles
    },

    getTextAreaClassName () {
      const { prefixCls, disabled } = this.$props
      return {
        [prefixCls]: true,
        [`${prefixCls}-disabled`]: disabled,
      }
    },

    handleTextareaChange (e) {
      if (!hasProp(this, 'value')) {
        this.stateValue = e.target.value
        this.$nextTick(() => {
          this.resizeTextarea()
        })
      } else {
        this.$forceUpdate()
        this.$emit('change.value', e.target.value)
        this.$emit('change', e)
      }
      this.$emit('input', e)
    },

    focus () {
      this.$refs.textArea.focus()
    },

    blur () {
      this.$refs.textArea.blur()
    },

  },
  render () {
    const { stateValue,
      getTextAreaClassName,
      handleKeyDown,
      handleTextareaChange,
      textareaStyles,
      $attrs,
      $listeners,
    } = this
    const otherProps = omit(this.$props, [
      'prefixCls',
      'autosize',
      'type',
    ])
    const textareaProps = {
      attrs: { ...otherProps, ...$attrs },
      on: {
        ...$listeners,
        keydown: handleKeyDown,
        input: handleTextareaChange,
      },
    }
    return (
      <textarea
        {...textareaProps}
        value={stateValue}
        class={getTextAreaClassName()}
        style={textareaStyles}
        ref='textArea'
      />
    )
  },
}

