<script>
import Star from './Star.vue'
import Icon from '../icon'
import { getOffsetLeft, deepClone } from './util'
import { cloneVNodes } from '../_util/vnode'

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
  render (createElement) {
    const {
      classes, onMouseLeave, onClick, countList, onHover,
      disabled, prefixCls, allowHalf, hoverValue,
      stateValue, character, hasDefaultSlot,
    } = this
    return (
      <ul
        class={classes}
        onMouseleave={onMouseLeave}>
        {
          countList.map((item, i) => {
            return (
              <Star
                ref={'stars' + i}
                index={i}
                disabled={disabled}
                prefixCls={`${prefixCls}-star`}
                allowHalf={allowHalf}
                value={hoverValue === undefined ? stateValue : hoverValue}
                onClick={onClick}
                onHover={onHover}
                key={i}>
                {(hasDefaultSlot) ? (cloneVNodes(this.$slots.default, true)) : character}
              </Star>
            )
          })
        }
      </ul>
    )
  },
}
</script>
