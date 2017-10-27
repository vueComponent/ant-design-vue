<template>
  <div>
    <Radio v-model="checked" @change="change" name="test" value="123">Radio</Radio>
    <Radio :checked="false" @change="change" name="test2" value="222">Radio</Radio>

    <RadioGroup v-model="value" @change="change">
      <AntButton @click="handleAddClick">
        {{showMore ? "删除": "添加"}}
      </AntButton>
      <Radio name="test1" value="1">Radio1</Radio>
      <Radio name="test2" value="2" disabled>Radio2</Radio>
      <Radio name="test3" value="3" @change="change">Radio3</Radio>
      <Radio v-if="showMore" name="test4" value="4">Radio4</Radio>
    </RadioGroup>
    <RadioGroup :options="options" v-model="value1"  @change="change"></RadioGroup>
  </div>
</template>
<script>
import { Button, Radio } from '../components/index'
export default {
  data () {
    return {
      visible: true,
      checked: false,
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: true },
      ],
      value: '1',
      value1: '',
      showMore: false,
    }
  },
  methods: {
    change (event) {
      console.log(event)
    },
    handleClick () {
      this.value = ['1', '2', '3']
    },
    handleAddClick () {
      this.showMore = !this.showMore
    },
  },
  components: {
    Radio,
    RadioGroup: Radio.Group,
    AntButton: Button,
  },
}
</script>
