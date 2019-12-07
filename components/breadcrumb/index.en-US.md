## API

| Property | Description | Type | Optional | Default |
| --- | --- | --- | --- | --- |
| itemRender | Custom item renderer, slot="itemRender" and slot-scope="{route, params, routes, paths}" | ({route, params, routes, paths}) => vNode |  | - |
| params | Routing parameters | object |  | - |
| routes | The routing stack information of router | object\[] |  | - |
| separator | Custom separator | string\|slot |  | `/` |

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
            breadcrumbName: '首页',
          },
          {
            path: 'first',
            breadcrumbName: '一级面包屑',
          },
          {
            path: 'second',
            breadcrumbName: '当前页面',
          },
        ],
      };
    },
  };
</script>
```
