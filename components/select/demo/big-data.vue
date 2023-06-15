<docs>
---
order: 15
title:
  zh-CN: 大数据
  en-US: Big Data
---

## zh-CN

Select 使用了虚拟滚动技术，因而获得了比 1.x 更好的性能

## en-US

Select use virtual scroll which get better performance than 1.x

</docs>

<template>
  <h2>{{ options.length }} Items</h2>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select"
    :options="options"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const options: { value: string; disabled: boolean }[] = [];
for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({
    value,
    disabled: i === 10,
  });
}

const value = ref(['a10', 'c12']);
</script>
