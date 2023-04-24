<docs>
---
order: 7
title:
  zh-CN: 前缀
  en-US: Prefix
---

## zh-CN

在输入框上添加前缀图标。

## en-US

Add a prefix inside input.

</docs>

<template>
  <a-input-number v-model:value="value1" prefix="￥" style="width: 100%" />
  <br />
  <br />
  <a-input-number v-model:value="value2" prefix="￥" style="width: 100%">
    <template #addonBefore>
      <UserOutlined />
    </template>
  </a-input-number>
  <br />
  <br />
  <a-input-number v-model:value="value3" prefix="￥" disabled style="width: 100%" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
const value1 = ref<number>(1);
const value2 = ref<number>(2);
const value3 = ref<number>(3);
</script>
