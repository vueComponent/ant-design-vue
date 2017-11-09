<template>
  <ul
    :class="classes"
    @mouseleave="onMouseLeave">
    <template v-for="i in count">
      <Star
        ref="stars"
        :index="i - 1"
        :disabled="disabled"
        :prefix-cls="`${prefixCls}-star`"
        :allowHalf="allowHalf"
        :value="hoverValue === undefined ? stateValue : hoverValue"
        @click="onClick"
        @hover="onHover"
        :key="i - 1">
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
import Icon from '../icon'
import { getOffsetLeft } from './util'

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
  },
  methods: {
    onClick (event, index) {
      const value = this.getStarValue(index, event.pageX)
      if (this.value === undefined) {
        this.stateValue = value
      }
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
      return this.$refs.stars[index].$el
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
}
</script>
