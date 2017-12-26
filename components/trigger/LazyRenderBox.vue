<script>
import PropTypes from '../_util/vue-types'

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render () {
    const { hiddenClassName, visible } = this.$props

    if (hiddenClassName || this.$slots.default.length > 1) {
      let cls = ''
      if (!visible && hiddenClassName) {
        cls += ` ${hiddenClassName}`
      }
      return (
        <div class={cls}>
          {this.$slots.default}
        </div>
      )
    }

    return this.$slots.default[0]
  },
}

</script>
