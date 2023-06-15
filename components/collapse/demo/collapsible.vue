<docs>
---
order: 7
title:
  zh-CN: 可折叠触发区域
  en-US: Collapsible
---

## zh-CN

通过 `collapsible` 属性，可以设置面板的可折叠触发区域。

## en-US

Specify the trigger area of collapsible by `collapsible`.

</docs>

<template>
  <a-space direction="vertical">
    <a-collapse v-model:activeKey="activeKey" collapsible="header">
      <a-collapse-panel key="1" header="This panel can only be collapsed by clicking text">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse v-model:activeKey="activeKey" collapsible="icon">
      <a-collapse-panel key="1" header="This panel can only be collapsed by clicking icon">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-collapse collapsible="disabled">
      <a-collapse-panel key="1" header="This panel can't be collapsed">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const activeKey = ref(['1']);
const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;
</script>
<style scoped>
.ant-space {
  width: 100%;
}
</style>
