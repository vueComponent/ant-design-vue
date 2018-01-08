<script>
import { cloneElement } from './vnode'
import PropTypes from './vue-types'
export default {
  props: {
    childProps: PropTypes.object.def({}),
  },
  render () {
    const { $attrs, $listeners, childProps } = this
    let children = this.$slots.default[0]
    children = cloneElement(children, {
      attr: $attrs,
      on: $listeners,
      props: childProps,
    })
    return children
  },
}
</script>
