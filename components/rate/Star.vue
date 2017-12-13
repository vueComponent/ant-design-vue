<script>
import { deepClone } from './util'

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
    return createElement('li', {
      attrs: {
        class: this.getClassName,
      },
      on: {
        'click': this.onClick,
        'mousemove': this.onHover,
      },
    }, [
      createElement('div', {
        attrs: {
          class: `${this.prefixCls}-first`,
        },
      }, [
        ...this.$slots.default,
      ]),
      createElement('div', {
        attrs: {
          class: `${this.prefixCls}-second`,
        },
      }, [
        ...deepClone(this.$slots.default, createElement),
      ]),
    ])
  },
}
</script>
