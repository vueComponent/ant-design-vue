<template>
  <div>
    <CheckboxGroup :options="plainOptions" v-model="value" @change="onChange" />
    <br />
    <CheckboxGroup :options="plainOptions" :defaultValue="['Apple']" @change="onChange" />
    <br />
    <CheckboxGroup :options="options" :value="['Pear']" @change="onChange" />
    <br />
    <CheckboxGroup :options="optionsWithDisabled" disabled :defaultValue="['Apple']" @change="onChange" />
  </div>
</template>
<script>
import { Checkbox } from 'antd'
const plainOptions = ['Apple', 'Pear', 'Orange']
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
]
const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false },
]
export default {
  data () {
    return {
      plainOptions,
      options,
      optionsWithDisabled,
      value: [],
    }
  },
  methods: {
    onChange (checkedValues) {
      console.log('checked = ', checkedValues)
      console.log('value = ', this.value)
    },
  },
  components: {
    Checkbox,
    CheckboxGroup: Checkbox.Group,
  },
}
</script>
