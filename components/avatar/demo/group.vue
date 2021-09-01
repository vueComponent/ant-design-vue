<docs>
---
order: 4
title:
  zh-CN: Avatar.Group
  en-US: Avatar.Group
---

## zh-CN

头像组合展现。

## en-US

Avatar group display.
</docs>

<template>
  <a-avatar-group>
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="background-color: #f56a00">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><UserOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group :max-count="2" :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><UserOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group
    :max-count="2"
    size="large"
    :max-style="{
      color: '#f56a00',
      backgroundColor: '#fde3cf',
    }"
  >
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><UserOutlined /></template>
    </a-avatar>
  </a-avatar-group>
</template>

<script lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    UserOutlined,
  },
});
</script>
