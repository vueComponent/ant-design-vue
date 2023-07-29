<docs>
---
order: 3
title:
  zh-CN: 带面包屑页头
  en-US: Use with breadcrumbs
---

## zh-CN

带面包屑页头，适合层级比较深的页面，让用户可以快速导航。

## en-US

With breadcrumbs, it is suitable for deeper pages, allowing users to navigate quickly.

</docs>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Title"
    :breadcrumb="{ routes }"
    sub-title="This is a subtitle"
  />
</template>
<script lang="ts" setup>
const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];
</script>
