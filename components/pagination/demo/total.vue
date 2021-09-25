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
      :total="85"
      :show-total="total => `Total ${total} items`"
      :page-size="20"
    />
    <br />
    <a-pagination
      v-model:current="current2"
      :total="85"
      :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
      :page-size="20"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const current1 = ref<number>(1);
    const current2 = ref<number>(2);
    const onChange = (pageNumber: number) => {
      console.log('Page: ', pageNumber);
    };
    return {
      current1,
      current2,
      onChange,
    };
  },
});
</script>
