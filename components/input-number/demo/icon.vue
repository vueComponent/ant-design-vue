<docs>
---
order: 99
title:
  zh-CN: 图标按钮
  en-US: Icon
---

## zh-CN

使用 `upIcon` `downIcon` 插槽自定义图标。

## en-US

use `upIcon` `downIcon` custom icon

</docs>

<template>
  <div>
    <a-input-number id="inputNumber" v-model:value="value" :min="1" :max="10">
      <template #upIcon>
        <ArrowUpOutlined />
      </template>
      <template #downIcon>
        <ArrowDownOutlined />
      </template>
    </a-input-number>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
const value = ref<number>(3);
</script>
