<template>
  <RadioGroup name="radioGroup" :defaultValue="1">
    <Radio :value="1">A</Radio>
    <Radio :value="2">B</Radio>
    <Radio :value="3">C</Radio>
    <Radio :value="4">D</Radio>
  </RadioGroup>
</template>
<script>
import { Radio } from 'antd'
export default {
  components: {
    Radio,
    RadioGroup: Radio.Group,
  },
}
</script>
