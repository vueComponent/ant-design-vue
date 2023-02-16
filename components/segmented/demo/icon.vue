<docs>
---
order: 7
title:
  zh-CN: 设置图标
  en-US: With Icon
---

## zh-CN

给 Segmented Item 设置 Icon。

## en-US
Set `icon` for Segmented Item.
</docs>
<template>
  <a-segmented :options="data">
    <template #icon="index">
      <template v-if="index == 0">
        <unordered-list-outlined />
      </template>
      <template v-if="index == 1">
        <appstore-outlined />
      </template>
    </template>
  </a-segmented>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: { UnorderedListOutlined, AppstoreOutlined },
  setup() {
    const data = reactive([
      {
        value: 'List',
      },
      {
        value: 'Kanban',
      },
    ]);
    return {
      data,
    };
  },
});
</script>
