<docs>
---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic Usage
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.
</docs>

<template>
  <a-anchor
    :items="[
      {
        key: 'part-1',
        href: '#part-1',
        title: () => h('span', { style: 'color: red' }, 'Part 1'),
      },
      {
        key: 'part-2',
        href: '#part-2',
        title: 'Part 2',
      },
      {
        key: 'part-3',
        href: '#part-3',
        title: 'Part 3',
      },
    ]"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
</script>
