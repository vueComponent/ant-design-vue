<docs>
---
order: 2
title:
  zh-CN: 面板嵌套
  en-US: Nested panel
---

## zh-CN

嵌套折叠面板。

## en-US

`Collapse` is nested inside the `Collapse`.

</docs>

<template>
  <a-collapse v-model:activeKey="activeKey" @change="changeActivekey">
    <a-collapse-panel key="1" header="This is panel header 1">
      <a-collapse default-active-key="4">
        <a-collapse-panel key="4" header="This is panel nest panel">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="This is panel header 3">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const activeKey = ref([]);
const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;

const changeActivekey = (key: string) => {
  console.log(key);
};
</script>
