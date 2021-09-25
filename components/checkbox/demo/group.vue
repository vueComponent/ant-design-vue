<docs>
---
order: 4
title:
  zh-CN: Checkbox 组
  en-US: Checkbox group
---

## zh-CN

方便的从数组生成 checkbox

## en-US

Generate a group of checkboxes from an array

</docs>

<template>
  <a-checkbox-group v-model:value="value1" name="checkboxgroup" :options="plainOptions" />
  <br />
  <a-checkbox-group v-model:value="value2" :options="plainOptions" />
  <br />
  <a-checkbox-group v-model:value="value3" :options="options" />
  <br />
  <a-checkbox-group v-model:value="value4" :options="optionsWithDisabled" disabled>
    <template #label="{ value }">
      <span style="color: red">{{ value }}</span>
    </template>
  </a-checkbox-group>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

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
export default defineComponent({
  setup() {
    const state = reactive({
      value1: [],
      value2: ['Apple'],
      value3: ['Pear'],
      value4: ['Apple'],
    });

    return {
      plainOptions,
      options,
      optionsWithDisabled,
      ...toRefs(state),
    };
  },
});
</script>
