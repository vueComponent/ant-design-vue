<docs>
---
order: 0
title:
  zh-CN: 折叠面板
  en-US: Collapse
---

## zh-CN

可以同时展开多个面板，这个例子默认展开了第一个。

## en-US

By default, any number of panels can be expanded at a time. The first panel is expanded in this example.

</docs>

<template>
  <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel key="1" header="This is panel header 1">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="This is panel header 3" collapsible="disabled">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
const activeKey = ref(['1']);

watch(activeKey, val => {
  console.log(val);
});
</script>
