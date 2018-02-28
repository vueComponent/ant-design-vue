<script>
import PropTypes from '../_util/vue-types'
import { cloneElement } from '../_util/vnode'
export default {
  props: {
    value: PropTypes.any,
    disabled: PropTypes.bool,
  },
  methods: {
    focus  () {
      const ele = this.$refs.ele
      ele.focus ? ele.focus() : this.$el.focus()
    },
    blur () {
      const ele = this.$refs.ele
      ele.blur ? ele.blur() : this.$el.blur()
    },

  },

  render () {
    const { $slots = {}, $listeners = {}, $props = {}, $attrs = {}} = this
    const value = $props.value === undefined ? '' : $props.value
    return cloneElement($slots.default[0], {
      domProps: {
        value,
      },
      props: $props,
      on: $listeners,
      attrs: { ...$attrs, value },
      ref: 'ele',
    })
  },
}

</script>
