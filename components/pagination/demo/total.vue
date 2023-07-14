<docs>
---
order: 7
title:
  zh-CN: 总数
  en-US: Total number
---

## zh-CN

通过设置 `showTotal` 展示总共有多少数据。

## en-US

You can show the total number of data by setting `showTotal`.
</docs>

<template>
  <div>
    <a-pagination
      v-model:current="current1"
      v-model:page-size="pageSize1"
      :total="85"
      :show-total="total => `Total ${total} items`"
    />
    <br />
    <a-pagination
      v-model:current="current2"
      v-model:page-size="pageSize2"
      :total="85"
      :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const current1 = ref<number>(1);
const current2 = ref<number>(2);
const pageSize1 = ref<number>(20);
const pageSize2 = ref<number>(20);
</script>
