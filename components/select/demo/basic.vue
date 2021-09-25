<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
---

## zh-CN

基本使用。

## en-US

Basic Usage

</docs>

<template>
  <h2>use a-select-option</h2>
  <a-space>
    <a-select
      ref="select"
      v-model:value="value1"
      style="width: 120px"
      @focus="focus"
      @change="handleChange"
    >
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
      <a-select-option value="disabled" disabled>Disabled</a-select-option>
      <a-select-option value="Yiminghe">yiminghe</a-select-option>
    </a-select>
    <a-select v-model:value="value2" style="width: 120px" disabled>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
    <a-select v-model:value="value3" style="width: 120px" loading>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
  </a-space>
  <h2 style="margin-top: 10px">use options (recommend)</h2>
  <a-space>
    <a-select
      ref="select"
      v-model:value="value1"
      style="width: 120px"
      :options="options1"
      @focus="focus"
      @change="handleChange"
    ></a-select>
    <a-select v-model:value="value2" style="width: 120px" disabled :options="options2"></a-select>
    <a-select v-model:value="value3" style="width: 120px" loading :options="options3"></a-select>
  </a-space>
</template>
<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const options1 = ref<SelectProps['options']>([
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
      {
        value: 'disabled',
        label: 'Disabled',
        disabled: true,
      },
      {
        value: 'yiminghe',
        label: 'Yiminghe',
      },
    ]);
    const options2 = ref<SelectProps['options']>([
      {
        value: 'lucy',
        label: 'Lucy',
      },
    ]);
    const options3 = ref<SelectProps['options']>([
      {
        value: 'lucy',
        label: 'Lucy',
      },
    ]);
    const focus = () => {
      console.log('focus');
    };

    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };

    return {
      focus,
      handleChange,
      value1: ref('lucy'),
      value2: ref('lucy'),
      value3: ref('lucy'),
      options1,
      options2,
      options3,
    };
  },
});
</script>
