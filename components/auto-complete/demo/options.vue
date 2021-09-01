<docs>
---
order: 1
title:
  zh-CN: 自定义选项
  en-US: Customized
---

## zh-CN

也可以直接传递 #dataSource 的Option。

## en-US

You could pass `#dataSource` as children of `AutoComplete`, instead of using `dataSource`.
</docs>

<template>
  <a-auto-complete
    v-model:value="value"
    style="width: 200px"
    placeholder="input here"
    @search="handleSearch"
  >
    <template #dataSource>
      <a-select-option v-for="email in result" :key="email">
        {{ email }}
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const value = ref('');
    const result = ref<string[]>([]);
    const handleSearch = (val: string) => {
      let res: string[];
      if (!val || val.indexOf('@') >= 0) {
        res = [];
      } else {
        res = ['gmail.com', '163.com', 'qq.com'].map(domain => `${val}@${domain}`);
      }
      result.value = res;
    };

    return {
      value,
      result,
      handleSearch,
    };
  },
});
</script>
