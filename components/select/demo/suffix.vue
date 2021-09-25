<docs>
---
order: 11
title:
  zh-CN: 后缀图标
  en-US: Suffix
---

## zh-CN

基本使用。

## en-US

Basic Usage

</docs>

<template>
  <a-space>
    <a-select
      v-model:value="value1"
      style="width: 120px"
      :options="options1"
      @change="handleChange"
    >
      <template #suffixIcon><smile-outlined /></template>
    </a-select>
    <a-select v-model:value="value2" style="width: 120px" disabled :options="options2">
      <template #suffixIcon><meh-outlined /></template>
    </a-select>
  </a-space>
</template>
<script lang="ts">
import { SmileOutlined, MehOutlined } from '@ant-design/icons-vue';
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    SmileOutlined,
    MehOutlined,
  },
  setup() {
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };

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
    return {
      handleChange,
      value1: ref('lucy'),
      value2: ref('lucy'),
      options1,
      options2,
    };
  },
});
</script>
