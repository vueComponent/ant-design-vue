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
  <a-checkbox-group v-model:value="state.value1" name="checkboxgroup" :options="plainOptions" />
  <br />
  <br />
  <a-checkbox-group v-model:value="state.value2" :options="plainOptions" />
  <br />
  <br />
  <a-checkbox-group v-model:value="state.value3" :options="options" />
  <br />
  <br />
  <a-checkbox-group v-model:value="state.value4" :options="optionsWithDisabled" disabled>
    <template #label="{ label }">
      <span style="color: red">{{ label }}</span>
    </template>
  </a-checkbox-group>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];
const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false },
];
const state = reactive({
  value1: [],
  value2: ['Apple'],
  value3: ['Pear'],
  value4: ['Apple'],
});
</script>
