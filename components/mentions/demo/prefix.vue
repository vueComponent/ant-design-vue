<docs>
---
order: 2
title:
  zh-CN: 自定义触发字符
  en-US: Customize Trigger Token
---

## zh-CN

通过 prefix 属性自定义触发字符。默认为 @, 可以定义为数组。

## en-US

Customize Trigger Token by `prefix` props. Default to `@`, `Array<string>` also supported.

</docs>
<template>
  <a-mentions
    v-model:value="value"
    placeholder="input @ to mention people, # to mention tag"
    :prefix="['@', '#']"
    @search="onSearch"
  >
    <a-mentions-option v-for="val in options" :key="val" :value="val">
      {{ val }}
    </a-mentions-option>
  </a-mentions>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
const MOCK_DATA: Record<string, string[]> = {
  '@': ['afc163', 'zombiej', 'yesmeck'],
  '#': ['1.0', '2.0', '3.0'],
};
export default defineComponent({
  setup() {
    const prefix = ref<string>('@');
    const value = ref<string>('');
    const options = computed(() => {
      return MOCK_DATA[prefix.value] || [];
    });

    const onSearch = (_: string, val: string) => {
      console.log(_, val);
      prefix.value = val;
    };

    return {
      value,
      options,
      onSearch,
    };
  },
});
</script>
