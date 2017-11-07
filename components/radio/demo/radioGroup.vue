<template>
  <RadioGroup @change="onChange" v-model="value">
    <Radio :value="1">A</Radio>
    <Radio :value="2">B</Radio>
    <Radio :value="3">C</Radio>
    <Radio :value="4">D</Radio>
  </RadioGroup>
</template>
<script>
import { Radio } from 'antd'
export default {
  data () {
    return {
      value: 1,
    }
  },
  methods: {
    onChange (e) {
      console.log('radio checked', e.target.value)
    },
  },
  components: {
    Radio,
    RadioGroup: Radio.Group,
  },
}
</script>
