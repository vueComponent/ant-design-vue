<docs>
---
order: 4
title:
  zh-CN: 附加内容
  en-US: Extra Content
---

## zh-CN

可以在页签右边添加附加操作。

## en-US

You can add extra actions to the right of Tabs.

</docs>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Tab 1">Content of tab 1</a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2">Content of tab 2</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of tab 3</a-tab-pane>
    <template #tabBarExtraContent>
      <a-button>Extra Action</a-button>
    </template>
  </a-tabs>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    return {
      activeKey: ref('1'),
    };
  },
});
</script>
