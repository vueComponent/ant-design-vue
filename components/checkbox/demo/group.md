<cn>
#### Checkbox组
方便的从数组生成checkbox
</cn>

<us>
#### Checkbox group
Generate a group of checkboxes from an array
</us>

```tpl
<template>
  <div>
    <a-checkbox-group :options="plainOptions" v-model="value" @change="onChange" />
    <br />
    <a-checkbox-group :options="plainOptions" :defaultValue="['Apple']" @change="onChange" />
    <br />
    <a-checkbox-group :options="options" :value="['Pear']" @change="onChange" />
    <br />
    <a-checkbox-group
      :options="optionsWithDisabled"
      disabled
      :defaultValue="['Apple']"
      @change="onChange"
    >
      <span style="color: red" slot="label" slot-scope="{value}">{{value}}</span>
    </a-checkbox-group>
  </div>
</template>
<script>
  const plainOptions = ['Apple', 'Pear', 'Orange'];
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  const optionsWithDisabled = [
    { value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: false },
  ];
  export default {
    data() {
      return {
        plainOptions,
        options,
        optionsWithDisabled,
        value: [],
      };
    },
    methods: {
      onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        console.log('value = ', this.value);
      },
    },
  };
</script>
```
