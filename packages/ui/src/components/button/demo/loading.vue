<template>
  <a-space direction="vertical">
    <a-space>
      <a-button type="primary" loading>Loading</a-button>
      <a-button type="primary" size="small" loading>Loading</a-button>
    </a-space>
    <a-space>
      <a-button type="primary" :loading="loading" @mouseenter="loading = true">
        mouseenter me!
      </a-button>
      <a-button type="primary" :loading="iconLoading" @click="enterIconLoading">
        <template #icon><PoweroffOutlined /></template>
        Delay 1s
      </a-button>
    </a-space>
    <a-space>
      <a-button type="primary" loading />
      <a-button type="primary" shape="circle" loading />
      <a-button danger shape="round" loading />
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { PoweroffOutlined } from '@ant-design/icons-vue';

interface DelayLoading {
  delay: number;
}
const loading = ref<boolean>(false);
const iconLoading = ref<boolean | DelayLoading>(false);
const enterIconLoading = () => {
  iconLoading.value = { delay: 1000 };

  setTimeout(() => {
    iconLoading.value = false;
  }, 6000);
};
</script>
