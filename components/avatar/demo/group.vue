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
    <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
    <a href="https://www.antdv.com">
      <a-avatar style="background-color: #f56a00">K</a-avatar>
    </a>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group :max-count="2" :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
    <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
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
    <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group
    :max-count="2"
    max-popover-trigger="click"
    size="large"
    :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }"
  >
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="background-color: #f56a00">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group shape="square">
    <a-avatar style="background-color: #fde3cf">A</a-avatar>
    <a-avatar style="background-color: #f56a00">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
</template>

<script lang="ts" setup>
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons-vue';
</script>
