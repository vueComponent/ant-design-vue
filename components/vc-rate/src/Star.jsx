import PropTypes from '../../_util/vue-types'

export default {
  name: 'Star',
  props: {
    value: PropTypes.number,
    index: PropTypes.number,
    prefixCls: PropTypes.string,
    allowHalf: PropTypes.bool,
    disabled: PropTypes.bool,
    character: PropTypes.any,
    focused: PropTypes.bool,
  },
  methods: {
    onHover (e) {
      const { index } = this
      this.$emit('hover', e, index)
    },
    onClick (e) {
      const { index } = this
      this.$emit('click', e, index)
    },
    getClassName () {
      const { prefixCls, index, value, allowHalf, focused } = this
      const starValue = index + 1
      let className = prefixCls
      if (value === 0 && index === 0 && focused) {
        className += ` ${prefixCls}-focused`
      } else if (allowHalf && value + 0.5 === starValue) {
        className += ` ${prefixCls}-half ${prefixCls}-active`
        if (focused) {
          className += ` ${prefixCls}-focused`
        }
      } else {
        className += starValue <= value ? ` ${prefixCls}-full` : ` ${prefixCls}-zero`
        if (starValue === value && focused) {
          className += ` ${prefixCls}-focused`
        }
      }
      return className
    },
  },
  render () {
    const { onHover, onClick, disabled, prefixCls } = this
    let character = this.character
    if (character === undefined) {
      character = this.$scopedSlots.character
    }
    return (
      <li
        class={this.getClassName()}
        onClick={disabled ? null : onClick}
        onMousemove={disabled ? null : onHover}
      >
        <div class={`${prefixCls}-first`}>{character}</div>
        <div class={`${prefixCls}-second`}>{character}</div>
      </li>
    )
  },
}
