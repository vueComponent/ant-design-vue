<docs>
---
order: 4
title:
  zh-CN: 包含子组件
  en-US: Contains sub component
---

## zh-CN

加载占位图包含子组件。

## en-US

Skeleton contains sub component.

</docs>

<template>
  <a-space direction="vertical" style="width: 100%" :size="16">
    <a-skeleton :loading="loading">
      <div>
        <h4>Ant Design Vue, a design language</h4>
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully
          and efficiently.
        </p>
      </div>
    </a-skeleton>
    <a-button :disabled="loading" @click="showSkeleton">Show Skeleton</a-button>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref<boolean>(false);

const showSkeleton = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>
