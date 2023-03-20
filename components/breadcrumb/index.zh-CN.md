---
category: Components
subtitle: 面包屑
type: 导航
title: Breadcrumb
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*I5a2Tpqs3y0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Tr90QKrE_LcAAAAAAAAAAAAADrJ8AQ/original
---

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

- 当系统拥有超过两级以上的层级结构时；
- 当需要告知用户『你在哪里』时；
- 当需要向上导航的功能时。

## API

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| itemRender | 自定义链接函数，和 vue-router 配置使用， 也可使用 #itemRender="props" | ({route, params, routes, paths}) => vNode |  | - |
| params | 路由的参数 | object |  | - |
| routes | router 的路由栈信息 | [routes\[\]](#routes) |  | - |
| separator | 分隔符自定义 | string\|slot |  | '/' |

### Breadcrumb.Item

| 参数    | 参数           | 类型                                   | 默认值 | 版本  |
| ------- | -------------- | -------------------------------------- | ------ | ----- |
| href    | 链接的目的地   | string                                 | -      | 1.5.0 |
| overlay | 下拉菜单的内容 | [Menu](/components/menu) \| () => Menu | -      | 1.5.0 |

#### 事件

| 事件名称 | 说明     | 回调参数             | 版本 |       |
| -------- | -------- | -------------------- | ---- | ----- |
| click    | 单击事件 | (e:MouseEvent)=>void | -    | 1.5.0 |

### Breadcrumb.Separator `1.5.0`

| 参数 | 类型 | 默认值 | 版本 |
| ---- | ---- | ------ | ---- |
| -    | -    | -      | -    |

> 注意：在使用 `Breadcrumb.Separator` 时，其父组件的分隔符必须设置为 `separator=""`，否则会出现父组件默认的分隔符。

### routes

```ts
interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}
```

### 和 browserHistory 配合

和 vue-router 一起使用时，默认生成的 url 路径是带有 `#` 的，如果和 browserHistory 一起使用的话，你可以使用 `itemRender` 属性定义面包屑链接。

```html
<template>
  <a-breadcrumb :routes="routes">
    <template #itemRender="{ route, params, routes, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
      <router-link v-else :to="paths.join('/')">{{route.breadcrumbName}}</router-link>
    </template>
  </a-breadcrumb>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  interface Route {
    path: string;
    breadcrumbName: string;
    children?: Array<{
      path: string;
      breadcrumbName: string;
    }>;
  }
  export default defineComponent({
    setup() {
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
      return {
        routes,
      };
    },
  });
</script>
```
