<template>
  <a-space direction="vertical">
    <a-space wrap>
      <a-tooltip title="search">
        <a-button type="primary" shape="circle">
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-button type="primary" shape="circle">A</a-button>
      <a-button type="primary">
        <template #icon><SearchOutlined /></template>
        Search
      </a-button>
      <a-tooltip title="search">
        <a-button shape="circle">
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-button>
        <template #icon><SearchOutlined /></template>
        Search
      </a-button>
    </a-space>
    <a-space wrap>
      <a-tooltip title="search">
        <a-button shape="circle">
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-button>
        <template #icon><SearchOutlined /></template>
        Search
      </a-button>
      <a-tooltip title="search">
        <a-button type="dashed" shape="circle">
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-button type="dashed">
        <template #icon><SearchOutlined /></template>
        Search
      </a-button>
      <a-button href="https://www.google.com">
        <template #icon><SearchOutlined /></template>
      </a-button>
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue';
</script>
