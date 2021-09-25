<docs>
---
order: 4
title:
  zh-CN: 搜索框 loading
  en-US: Search box with loading
---

## zh-CN

用于 `onSearch` 的时候展示 `loading`。

## en-US

Search loading when onSearch.

</docs>
<template>
  <div>
    <a-input-search v-model:value="value" placeholder="input search loading deault" loading />
    <br />
    <br />
    <a-input-search
      v-model:value="value"
      placeholder="input search loading with enterButton"
      loading
      enter-button
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const value = ref<string>('');
    return {
      value,
    };
  },
});
</script>
