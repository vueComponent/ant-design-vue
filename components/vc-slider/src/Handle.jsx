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
    // handleFocus: PropTypes.func.def(noop),
    // handleBlur: PropTypes.func.def(noop),
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
    })
  },
  beforeDestroy () {
    if (this.onMouseUpListener) {
      this.onMouseUpListener.remove()
    }
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
    handleBlur (e) {
      this.setClickFocus(false)
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
      prefixCls, vertical, offset, disabled, min, max, value, tabIndex,
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
        ...ariaProps,
      },
      class: className,
      on: {
        ...this.$listeners,
        blur: this.handleBlur,
        keydown: this.handleKeyDown,
      },
      ref: 'handle',
      style: elStyle,
    }
    return (
      <div
        {...handleProps}
      />
    )
  },
}
