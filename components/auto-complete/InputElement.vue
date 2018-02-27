<script>
import omit from 'omit.js'
import { cloneElement } from '../_util/vnode'
export default {
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
    const { $slots, $listeners, $props, $attrs } = this
    return cloneElement($slots.default, {
      domProps: {
        value: $props.value,
      },
      props: omit($props, ['value']),
      on: $listeners,
      attrs: { ...$attrs, value: $props.value },
      ref: 'ele',
    })
  },
}

</script>
