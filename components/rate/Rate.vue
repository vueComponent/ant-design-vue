<script>
import Star from './Star.vue'
import Icon from '../icon'
import { getOffsetLeft, deepClone } from './util'

export default {
  name: 'Rate',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-rate',
    },
    count: {
      type: Number,
      default: 5,
    },
    value: Number,
    defaultValue: {
      type: Number,
      default: 0,
    },
    allowHalf: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    character: {
      type: String,
      default: '★',
    },
  },
  data () {
    const { value, defaultValue } = this
    const reValue = value === undefined ? defaultValue : value
    return {
      hoverValue: undefined,
      stateValue: reValue,
    }
  },
  computed: {
    classes () {
      const { prefixCls, disabled } = this
      return {
        [`${prefixCls}`]: true,
        [`${prefixCls}-disabled`]: disabled,
      }
    },
    countList () {
      return new Array(this.count).fill(1)
    },
    hasDefaultSlot () {
      return !!this.$slots.default
    },
  },
  methods: {
    onClick (event, index) {
      const value = this.getStarValue(index, event.pageX)
      this.stateValue = value
      this.onMouseLeave()
      this.$emit('input', value)
      this.$emit('change', value)
    },
    onHover (event, index) {
      const value = this.getStarValue(index, event.pageX)
      this.hoverValue = value
      this.$emit('hover-change', value)
    },
    getStarDOM (index) {
      return this.$refs['stars' + index].$el
    },
    getStarValue (index, x) {
      const { allowHalf, getStarDOM } = this
      let value = index + 1
      if (allowHalf) {
        const leftEdge = getOffsetLeft(getStarDOM(0))
        const width = getOffsetLeft(getStarDOM(1)) - leftEdge
        if ((x - leftEdge - width * index) < width / 2) {
          value -= 0.5
        }
      }
      return value
    },
    onMouseLeave () {
      if (this.disabled) return
      this.hoverValue = undefined
      this.$emit('hover-change')
    },
  },
  watch: {
    value (val) {
      this.stateValue = val
    },
  },
  components: {
    Star,
    Icon,
  },
  render (createElement, a) {
    const self = this
    return createElement('ul', {
      class: self.classes,
      on: {
        'mouseleave': self.onMouseLeave,
      },
    }, [
      (
        self.countList.map((item, i) => {
          return createElement('Star', {
            attrs: {
              index: i,
              disabled: self.disabled,
              'prefix-cls': `${self.prefixCls}-star`,
              allowHalf: self.allowHalf,
              value: self.hoverValue === undefined ? self.stateValue : self.hoverValue,
            },
            ref: 'stars' + i,
            key: i,
            on: {
              'click': self.onClick,
              'hover': self.onHover,
            },
          }, [
            ((self.hasDefaultSlot) ? (deepClone(self.$slots.default, createElement)) : this.character),
          ])
        })
      ),
    ])
  },
}
</script>
