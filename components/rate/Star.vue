<script>
import { cloneVNodes } from '../_util/vnode'

export default {
  name: 'Star',
  props: {
    index: Number,
    disabled: Boolean,
    prefixCls: String,
    allowHalf: Boolean,
    value: Number,
  },
  computed: {
    getClassName () {
      const { prefixCls, index, value, allowHalf } = this
      const starValue = index + 1
      if (allowHalf && value + 0.5 === starValue) {
        return `${prefixCls} ${prefixCls}-half ${prefixCls}-active`
      }
      return starValue <= value ? `${prefixCls} ${prefixCls}-full` : `${prefixCls} ${prefixCls}-zero`
    },
  },
  methods: {
    onClick (e) {
      if (this.disabled) return
      this.$emit('click', e, this.index)
    },
    onHover (e) {
      if (this.disabled) return
      this.$emit('hover', e, this.index)
    },
  },
  render (createElement) {
    const { getClassName, onClick, onHover, prefixCls } = this
    return (
      <li
        class={getClassName}
        onClick={onClick}
        onMousemove={onHover}
      >
        <div class={`${prefixCls}-first`}>
          {this.$slots.default}
        </div>
        <div class={`${prefixCls}-second`}>
          {cloneVNodes(this.$slots.default, true)}
        </div>
      </li>
    )
  },
}
</script>
