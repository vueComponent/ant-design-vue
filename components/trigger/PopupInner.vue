<script>
import PropTypes from 'vue-types'
import LazyRenderBox from './LazyRenderBox'

export default {
  props: {
    hiddenClassName: PropTypes.string.def(''),
    prefixCls: PropTypes.string,
  },
  methods: {
    onMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    onMouseLeave (e) {
      this.$emit('mouseleave', e)
    },
  },
  render () {
    const { prefixCls, visible, hiddenClassName } = this.$props
    const { onMouseEnter, onMouseLeave } = this
    let className = ''
    if (!visible) {
      className += ` ${hiddenClassName}`
    }
    return (
      <div
        class={className}
        onMouseenter={onMouseEnter}
        onMouseleave={onMouseLeave}
      >
        <LazyRenderBox class={`${prefixCls}-content`} visible={visible}>
          {this.$slots.default}
        </LazyRenderBox>
      </div>
    )
  },
}

</script>
