<template>
  <div>
    <Checkbox :defaultChecked="true" @change="change" value="1">1</Checkbox>
    <Checkbox v-model="checked" @change="change" value="2">2</Checkbox>
    <Checkbox @change="change" v-model="checked" name="test" value="123">Checkbox</Checkbox>
    <Checkbox @change="change" v-model="checked" name="test2" value="222">Checkbox</Checkbox>

    <CheckboxGroup v-model="value" @change="change">
      <AntButton @click="handleClick">
        全选
      </AntButton>
      <AntButton @click="handleAddClick">
        {{showMore ? "删除": "添加"}}
      </AntButton>
      <div>
        <Checkbox name="test1" value="1">Checkbox1</Checkbox>
      </div>
      <Checkbox name="test2" value="2" disabled>Checkbox2</Checkbox>
      <Checkbox name="test3" value="3" @change="change">Checkbox3</Checkbox>
      <Checkbox v-if="showMore" name="test4" value="4">Checkbox4</Checkbox>
    </CheckboxGroup>
    <CheckboxGroup :options="options" :defaultValue="['Apple']" @change="change"></CheckboxGroup>
  </div>
</template>
<script>
import { Button, Checkbox } from '../components/index'
export default {
  data () {
    return {
      visible: true,
      checked: true,
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false },
      ],
      value: ['1'],
      value1: [],
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
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    AntButton: Button,
  },
}
</script>
