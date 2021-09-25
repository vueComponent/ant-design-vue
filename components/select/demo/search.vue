<docs>
---
order: 9
title:
  zh-CN: 带搜索框
  en-US: Select with search field
---

## zh-CN

展开后可对选项进行搜索。

## en-US

Search the options while expanded.

</docs>

<template>
  <a-select
    v-model:value="value"
    show-search
    placeholder="Select a person"
    style="width: 200px"
    :options="options"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const options = ref<SelectProps['options']>([
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'tom', label: 'Tom' },
    ]);
    const handleChange = (value: string) => {
      console.log(`selected ${value}`);
    };
    const handleBlur = () => {
      console.log('blur');
    };
    const handleFocus = () => {
      console.log('focus');
    };
    const filterOption = (input: string, option: any) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    return {
      value: ref<string | undefined>(undefined),
      filterOption,
      handleBlur,
      handleFocus,
      handleChange,
      options,
    };
  },
});
</script>
