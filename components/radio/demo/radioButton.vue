<template>
  <div>
    <div>
      <RadioGroup @change="onChange" defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
    <div :style="{ marginTop: '16px' }">
      <RadioGroup @change="onChange" defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b" disabled>Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
    <div :style="{ marginTop: '16px' }">
      <RadioGroup disabled @change="onChange" defaultValue="a">
        <RadioButton value="a">Hangzhou</RadioButton>
        <RadioButton value="b">Shanghai</RadioButton>
        <RadioButton value="c">Beijing</RadioButton>
        <RadioButton value="d">Chengdu</RadioButton>
      </RadioGroup>
    </div>
  </div>
</template>
<script>
import { Radio } from 'antd'
export default {
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.value}`)
    },
  },
  components: {
    RadioButton: Radio.Button,
    RadioGroup: Radio.Group,
  },
}
</script>
