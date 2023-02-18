<docs>
---
order: 6
title:
 zh-CN: 动态数据
 en-US: Dynamic
---

## zh-CN

动态加载数据。

## en-US
Load dynamically.
</docs>
<template>
  <a-segmented :options="data"></a-segmented>
  <br />
  <br />
  <a-button type="primary" @click="loadMore" :disabled="isDisabled">Load More</a-button>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  setup() {
    const data = reactive(['Daily', 'Weekly', 'Monthly']);
    const isDisabled = ref<boolean>(false);
    const loadMore = () => {
      data.push(...['Quarterly', 'Yearly']);
      isDisabled.value = true;
    };
    return {
      data,
      loadMore,
      isDisabled,
    };
  },
});
</script>
