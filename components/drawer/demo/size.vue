<docs>
---
order: 7
title:
  zh-CN: 预设宽度
  en-US: Presetted size
---

## zh-CN

抽屉的默认宽度为 `378px`，另外还提供一个大号抽屉 `736px`，可以用 size 属性来设置。

## en-US

The default width (or height) of Drawer is `378px`, and there is a presetted large size `736px`.

</docs>

<template>
  <a-button type="primary" style="margin-right: 8px" @click="showDrawer('default')">
    Open Default Size (378px)
  </a-button>
  <a-button type="primary" @click="showDrawer('large')">Open Large Size (736px)</a-button>
  <a-drawer title="Basic Drawer" :size="size" :visible="visible" @close="onClose">
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
    const visible = ref<boolean>(false);
    const size = ref<string>('default');

    const showDrawer = (val: string) => {
      size.value = val;
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };
    return {
      visible,
      size,
      showDrawer,
      onClose,
    };
  },
});
</script>
