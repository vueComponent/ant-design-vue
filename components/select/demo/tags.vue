<docs>
---
order: 2
title:
  zh-CN: 标签
  en-US: Tags
---

## zh-CN

tags select，随意输入的内容（scroll the menu）

## en-US

Select with tags, transform input to tag (scroll the menu)

</docs>

<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    placeholder="Tags Mode"
    :options="options"
    @change="handleChange"
  ></a-select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};
const value = ref([]);
const options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
</script>
