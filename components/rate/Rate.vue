<template>
  <ul
    :class="classes"
    @mouseleave="onMouseLeave">
    <template v-for="i in count">
      <Star
        ref="stars"
        :index="i"
        :disabled="disabled"
        :prefix-cls="`${prefixCls}-star`"
        :allowHalf="allowHalf"
        :value="currentValue"
        @onClick="onClick"
        @onHover="onHover"
        :key="i">
        <template slot-scope="props">
          <slot>
            <span>{{character}}</span>
          </slot>
        </template>
      </Star>
    </template>
  </ul>
</template>

<script>
import Star from './Star.vue'
import Icon from '../icon/index'
import { getOffsetLeft } from '../util/util'

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
    onChange: {
      type: Function,
      default: () => {},
    },
    onHoverChange: {
      type: Function,
      default: () => {},
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
      currentValue: reValue,
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
  },
  methods: {
    onClick (event, index) {
      const clValue = this.getStarValue(index, event.pageX)
      this.stateValue = clValue
      this.onMouseLeave()
      this.$emit('input', clValue)
      this.onChange(clValue)
    },
    onHover (event, index) {
      this.currentValue = this.getStarValue(index, event.pageX)
      this.changeValue(this.currentValue)
      this.onHoverChange(this.currentValue)
    },
    getStarDOM (index) {
      return this.$refs.stars[index].$el
    },
    getStarValue (index, x) {
      let value = index
      if (this.allowHalf) {
        const leftEdge = getOffsetLeft(this.getStarDOM(0))
        const width = getOffsetLeft(this.getStarDOM(1)) - leftEdge
        if ((x - leftEdge - width * (index - 1)) < width / 2) {
          value -= 0.5
        }
      }
      return value
    },
    onMouseLeave () {
      this.currentValue = undefined
      this.changeValue()
      this.onHoverChange()
    },
    changeValue (val) {
      if (val === undefined) {
        this.currentValue = this.stateValue
      }
    },
  },
  watch: {
    value (val = 0) {
      this.currentValue = this.stateValue = val
      this.$emit('input', val)
    },
  },
  components: {
    Star,
    Icon,
  },
}
</script>
