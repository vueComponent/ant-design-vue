<docs>
---
order: 6
title:
  zh-CN: 额外节点
  en-US: Extra node
---

## zh-CN

可以同时展开多个面板，这个例子默认展开了第一个。

## en-US

More than one panel can be expanded at a time, the first panel is initialized to be active in this case.

</docs>

<template>
  <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
    <a-collapse-panel key="1" header="This is panel header 1">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="This is panel header 2">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </a-collapse-panel>
    <a-collapse-panel key="3" header="This is panel header 3" collapsible="disabled">
      <p>{{ text }}</p>
      <template #extra><setting-outlined @click="handleClick" /></template>
    </a-collapse-panel>
  </a-collapse>
  <br />
  <span>Expand Icon Position:</span>
  <a-select v-model:value="expandIconPosition">
    <a-select-option value="left">left</a-select-option>
    <a-select-option value="right">right</a-select-option>
  </a-select>
</template>
<script lang="ts">
import { SettingOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    SettingOutlined,
  },
  setup() {
    const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
    const activeKey = ref(['1']);
    const expandIconPosition = ref('left');

    const handleClick = (event: MouseEvent) => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    };
    watch(activeKey, val => {
      console.log(val);
    });

    return {
      text,
      activeKey,
      expandIconPosition,
      handleClick,
    };
  },
});
</script>
