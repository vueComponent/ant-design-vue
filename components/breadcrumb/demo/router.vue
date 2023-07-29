<docs>
---
order: 3
iframe: 200
reactRouter: react-router-dom
title:
  zh-CN: 其它路由
  en-US: Other Router Integration
---

## zh-CN
和 `vue-router` 进行结合使用。

## en-US
Used together with `vue-router`

</docs>

<template>
  <div>
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, paths }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="`${basePath}/${paths.join('/')}`">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
    <br />
    {{ $route.path }}
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}
const basePath = '/components/breadcrumb';
const routes = ref<Route[]>([
  {
    path: 'index',
    breadcrumbName: 'home',
  },
  {
    path: 'first',
    breadcrumbName: 'first',
    children: [
      {
        path: '/general',
        breadcrumbName: 'General',
      },
      {
        path: '/layout',
        breadcrumbName: 'Layout',
      },
      {
        path: '/navigation',
        breadcrumbName: 'Navigation',
      },
    ],
  },
  {
    path: 'second',
    breadcrumbName: 'second',
  },
]);
</script>
