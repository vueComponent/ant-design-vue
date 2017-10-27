<template>
  <div :class="`${prefixCls}`">
    <Radio v-for="item in options" :key="item.value" :checked="item.value === value"
      :value="item.value" :disabled="item.disabled" @change="handleChange">{{item.label}}</Radio>
    <slot v-if="options.length === 0"></slot>
  </div>
</template>
<script>
import Radio from './Radio.vue'
export default {
  name: 'Radio',
  props: {
    prefixCls: {
      default: 'ant-radio-button',
      type: String,
    },
    value: [String, Number],
    size: {
      default: 'default',
      validator (value) {
        return ['large', 'default', 'small'].includes(value)
      },
    },
    options: {
      default: () => [],
      type: Array,
    },
  },
  data () {
    return {
      curValue: this.value,
    }
  },
  model: {
    prop: 'value',
  },
  components: {
    Radio,
  },
}
</script>
