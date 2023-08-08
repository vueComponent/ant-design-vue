<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

头像有三种尺寸，两种形状可选。

## en-US

Three sizes and two shapes are available.
</docs>

<template>
  <a-space direction="vertical" :size="32">
    <a-space wrap :size="16">
      <a-avatar :size="64">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar size="large">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar>
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar size="small">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-space>
    <a-space wrap :size="16">
      <a-avatar shape="square" :size="64">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar shape="square" size="large">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar shape="square">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <a-avatar shape="square" size="small">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
</script>
