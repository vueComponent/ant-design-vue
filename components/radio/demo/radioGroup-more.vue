<template>
  <RadioGroup @change="onChange" v-model="value">
    <Radio :style="radioStyle" :value="1">Option A</Radio>
    <Radio :style="radioStyle" :value="2">Option B</Radio>
    <Radio :style="radioStyle" :value="3">Option C</Radio>
    <Radio :style="radioStyle" :value="4">
      More...
      <Input v-if="value === 4" :style="{ width: 100, marginLeft: 10 }" />
    </Radio>
  </RadioGroup>
</template>
<script>
import { Radio } from 'antd'
export default {
  data () {
    return {
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
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
