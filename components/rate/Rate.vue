<template>
  <ul
    :class="[prefixCls, disabled ? `${prefixCls}-disabled` : '', className]"
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
            <span v-html="character"></span>
          </slot>
        </template>
      </Star>
    </template>
  </ul>
</template>

<script>
import Vue from 'vue';
import Star from './Star.vue';
import Icon from '../icon/index';
import { getOffsetLeft } from '../util/util';

export default {
  name: 'Rate',
  props: {
    count: {
      type: Number,
      default: 5,
    },
    value: {
      type: Number,
      default: 0,
    },
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
      default: '★'
    },
    className: String,
  },
  data() {
    const reValue = this.value || this.defaultValue;
    return {
      prefixCls: 'ant-rate',
      hoverValue: undefined,
      currentValue: reValue,
      markValue: reValue,
    }
  },
  watch: {
    hoverValue(val) {
      if(val === undefined) {
        this.currentValue = this.markValue;
        return;
      }
      this.currentValue = val;
    },
    value() {
      this.currentValue = this.markValue = this.value || this.defaultValue;
    },
    markValue(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    onClick(event, index) {
      let clValue = this.getStarValue(index, event.pageX);
      this.markValue = clValue;
      this.onMouseLeave();
      this.onChange(clValue);
    },
    onHover(event, index) {
      this.hoverValue = this.getStarValue(index, event.pageX);
      this.onHoverChange(this.hoverValue);
    },
    getStarDOM (index) {
      return this.$refs.stars[index].$el
    },
    getStarValue (index, x) {
      let value = index;
      if (this.allowHalf) {
        const leftEdge = getOffsetLeft(this.getStarDOM(0))
        const width = getOffsetLeft(this.getStarDOM(1)) - leftEdge
        if ((x - leftEdge - width * (index-1)) < width / 2) {
          value -= 0.5
        }
      }
      return value
    },
    onMouseLeave() {
      this.hoverValue = undefined
      this.onHoverChange(undefined);
    },
  },
  components: {
    Star,
    Icon,
  }
}
</script>
