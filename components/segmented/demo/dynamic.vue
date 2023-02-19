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
  <a-segmented v-model:value="value" :options="data"></a-segmented>
  <br />
  <br />
  <a-button type="primary" :disabled="isDisabled" @click="loadMore">Load More</a-button>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  setup() {
    const data = reactive(['Daily', 'Weekly', 'Monthly']);
    const isDisabled = ref(false);
    const loadMore = () => {
      data.push(...['Quarterly', 'Yearly']);
      isDisabled.value = true;
    };
    const value = ref(data[0]);
    return {
      data,
      loadMore,
      isDisabled,
      value,
    };
  },
});
</script>
