---
category: Components
type: Navigation
title: Breadcrumb
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*I5a2Tpqs3y0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Tr90QKrE_LcAAAAAAAAAAAAADrJ8AQ/original
---

A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy.

## When To Use

- When the system has more than two layers in a hierarchy.
- When you need to inform the user of where they are.
- When the user may need to navigate back to a higher level.

## API

| Property | Description | Type | Optional | Default | Version |
| --- | --- | --- | --- | --- | --- |
| itemRender | Custom item renderer, #itemRender="{route, params, routes, paths}" | ({route, params, routes, paths}) => vNode |  | - |  |
| params | Routing parameters | object |  | - |  |
| routes | The routing stack information of router | [routes\[\]](#routes) |  | - |  |
| separator | Custom separator | string\|slot |  | `/` |  |

### Breadcrumb.Item

| Property | Description         | Type                                   | Default | Version |
| -------- | ------------------- | -------------------------------------- | ------- | ------- |
| href     | Target of hyperlink | string                                 | -       |         |
| overlay  | The dropdown menu   | [Menu](/components/menu) \| () => Menu | -       |         |

#### Events

| Events Name | Description                   | Arguments            | Version |       |
| ----------- | ----------------------------- | -------------------- | ------- | ----- |
| click       | handler to handle click event | (e:MouseEvent)=>void | -       | 1.5.0 |

### Breadcrumb.Separator `1.5.0`

| Property | Description | Type | Default | Version |
| -------- | ----------- | ---- | ------- | ------- |
| -        | -           | -    | -       | -       |

> When using `Breadcrumb.Separator`,its parent component must be set to `separator=""`, otherwise the default separator of the parent component will appear.

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

### Use with browserHistory

The link of Breadcrumb item targets `#` by default, you can use `itemRender` to make a `browserHistory` Link.

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
