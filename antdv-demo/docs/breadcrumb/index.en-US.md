## API

| Property | Description | Type | Optional | Default | Version |
| --- | --- | --- | --- | --- | --- |
| itemRender | Custom item renderer, slot="itemRender" and slot-scope="{route, params, routes, paths}" | ({route, params, routes, paths, h}) => vNode |  | - |  |
| params | Routing parameters | object |  | - |  |
| routes | The routing stack information of router | [routes\[\]](#routes) |  | - |  |
| separator | Custom separator | string\|slot |  | `/` |  |

### routes

```ts
interface Route {
  path: string;
  breadcrumbName: string;
  children: Array<{
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
    <template slot="itemRender" slot-scope="{route, params, routes, paths}">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{route.breadcrumbName}}
      </span>
      <router-link v-else :to="paths.join('/')">
        {{route.breadcrumbName}}
      </router-link>
    </template>
  </a-breadcrumb>
</template>
<script>
  export default {
    data() {
      return {
        routes: [
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
        ],
      };
    },
  };
</script>
```
