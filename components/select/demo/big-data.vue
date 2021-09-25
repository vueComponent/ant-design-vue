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
<script lang="ts">
import { defineComponent, reactive } from 'vue';
const options: { value: string; disabled: boolean }[] = [];
for (let i = 0; i < 10000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({
    value,
    disabled: i === 10,
  });
}
export default defineComponent({
  setup() {
    const state = reactive({
      options,
      value: ['a10', 'c12'],
    });
    return state;
  },
});
</script>
