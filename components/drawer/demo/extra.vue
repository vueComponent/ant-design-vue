<docs>
---
order: 2
title:
  zh-CN: 额外操作
  en-US: Extra Actions
---

## zh-CN

在 Ant Design 规范中，操作按钮建议放在抽屉的右上角，可以使用 extra 属性来实现。

## en-US

Extra actions should be placed at corner of drawer in Ant Design, you can using `extra` prop for that.

</docs>

<template>
  <a-radio-group v-model:value="placement" style="margin-right: 8px">
    <a-radio value="top">top</a-radio>
    <a-radio value="right">right</a-radio>
    <a-radio value="bottom">bottom</a-radio>
    <a-radio value="left">left</a-radio>
  </a-radio-group>
  <a-button type="primary" @click="showDrawer">Open</a-button>
  <a-drawer
    :width="500"
    title="Basic Drawer"
    :placement="placement"
    :visible="visible"
    @close="onClose"
  >
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const placement = ref<string>('left');
    const visible = ref<boolean>(false);

    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };
    return {
      placement,
      visible,
      showDrawer,
      onClose,
    };
  },
});
</script>
