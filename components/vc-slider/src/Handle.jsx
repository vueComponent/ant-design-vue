import PropTypes from '../../_util/vue-types'
import addEventListener from '../../_util/Dom/addEventListener'
import BaseMixin from '../../_util/BaseMixin'
import { getOptionProps } from '../../_util/props-util'

function noop () {}

export default {
  name: 'Handle',
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    vertical: PropTypes.bool,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    tabIndex: PropTypes.number,
    refStr: PropTypes.any,
    handleFocus: PropTypes.func.def(noop),
    handleBlur: PropTypes.func.def(noop),
  },
  data () {
    return {
      clickFocused: false,
    }
  },
  mounted () {
    this.$nextTick(() => {
      // mouseup won't trigger if mouse moved out of handle,
      // so we listen on document here.
      this.onMouseUpListener = addEventListener(document, 'mouseup', this.handleMouseUp)
      this.refStr = this.$props.refStr
    })
  },
  beforeDestroy () {
    this.$nextTick(() => {
      if (this.onMouseUpListener) {
        this.onMouseUpListener.remove()
      }
    })
  },
  methods: {
    setClickFocus (focused) {
      this.setState({ clickFocused: focused })
    },
    handleMouseUp () {
      if (document.activeElement === this.$refs.handle) {
        this.setClickFocus(true)
      }
    },
    onBlur (e) {
      this.setClickFocus(false)
      this.handleBlur(e)
    },
    onFocus (e) {
      this.handleFocus(e)
    },
    handleKeyDown () {
      this.setClickFocus(false)
    },
    clickFocus () {
      this.setClickFocus(true)
      this.focus()
    },
    focus () {
      this.$refs.handle.focus()
    },
    blur () {
      this.$refs.handle.blur()
    },
  },
  render () {
    const {
      prefixCls, vertical, offset, disabled, min, max, value, tabIndex, refStr,
    } = getOptionProps(this)

    const className = {
      [`${prefixCls}-handle`]: true,
      [`${prefixCls}-handle-click-focused`]: this.clickFocused,
    }

    const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` }
    const elStyle = {
      ...postionStyle,
    }
    let ariaProps = {}
    if (value !== undefined) {
      ariaProps = {
        ...ariaProps,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled,
      }
    }
    const handleProps = {
      attrs: {
        role: 'slider',
        tabIndex: disabled ? null : (tabIndex || 0),
        refStr,
        ...ariaProps,
      },
      style: elStyle,
      class: className,
      on: {
        blur: this.onBlur,
        focus: this.onFocus,
        keydown: this.handleKeyDown,
        ...this.$listeners,
      },
      ref: 'handle',
    }
    return (
      <div
        {...handleProps}
      />
    )
  },
}
