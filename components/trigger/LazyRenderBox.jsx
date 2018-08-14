
import PropTypes from '../_util/vue-types'
import { cloneVNode } from '../_util/vnode'

export default {
  props: {
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  },
  render () {
    const { hiddenClassName, visible } = this.$props
    let children = null
    if (hiddenClassName || !this.$slots.default || this.$slots.default.length > 1) {
      const cls = ''
      if (!visible && hiddenClassName) {
        // cls += ` ${hiddenClassName}`
      }
      children = (
        <div class={cls}>
          {visible ? this.$slots.default : (this.preChildren || this.$slots.default)}
        </div>
      )
    } else {
      children = visible ? this.$slots.default[0] : (this.preChildren || this.$slots.default[0])
    }
    // mock shouldComponentUpdate
    this.preChildren = visible ? cloneVNode(children) : this.preChildren
    return children
  },
}

