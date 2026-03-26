<template>
  <a-space direction="vertical">
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <a-space>
      <a-button type="primary" :size="size">Primary</a-button>
      <a-button :size="size">Normal</a-button>
      <a-button type="dashed" :size="size">Dashed</a-button>
      <a-button danger :size="size">Danger</a-button>
      <a-button type="link" :size="size">Link</a-button>
    </a-space>
    <a-space>
      <a-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" shape="circle" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
      <a-button type="primary" shape="round" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
      </a-button>
      <a-button type="primary" :size="size">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import { DownloadOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const size = ref<'large' | 'default' | 'small'>('large');
</script>
