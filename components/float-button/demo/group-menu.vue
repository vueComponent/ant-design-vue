<docs>
---
order: 6
iframe: 360
title:
  zh-CN: 菜单模式
  en-US: Menu mode
---

## zh-CN

设置 `trigger` 属性即可开启菜单模式。提供 `hover` 和 `click` 两种触发方式。

## en-US

Open menu mode with `trigger`, which could be `hover` or `click`.


</docs>

<template>
  <a-float-button-group trigger="click" type="primary" :style="{ right: '24px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
  <a-float-button-group trigger="hover" type="primary" :style="{ right: '94px' }">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<script lang="ts" setup>
import { CustomerServiceOutlined, CommentOutlined } from '@ant-design/icons-vue';
</script>
