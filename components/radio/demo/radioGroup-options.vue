<docs>
---
order: 5
title:
  zh-CN: RadioGroup 组合 - 配置方式
  en-US: RadioGroup group - optional
---

## zh-CN

通过配置 `options` 参数来渲染单选框。

## en-US

Render radios by configuring `options`.

</docs>
<template>
  <a-space direction="vertical">
    <a-radio-group v-model:value="value1" :options="plainOptions" />
    <a-radio-group v-model:value="value2" :options="optionsWithDisabled" />
    <a-radio-group v-model:value="value3" :options="plainOptions" disabled />
    <a-radio-group v-model:value="value1" option-type="button" :options="plainOptions" />
    <a-radio-group v-model:value="value2" option-type="button" :options="optionsWithDisabled" />
    <a-radio-group v-model:value="value3" option-type="button" :options="plainOptions" disabled />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { RadioGroupProps } from 'ant-design-vue';
const plainOptions = ['Apple', 'Pear', 'Orange'];
const optionsWithDisabled: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: true },
];
const value1 = ref<string>('Apple');
const value2 = ref<string>('Apple');
const value3 = ref<string>('Apple');
</script>
