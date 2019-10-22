## API

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| itemRender | 自定义链接函数，和 vue-router 配置使用， 也可使用 slot="itemRender" 和 slot-scope="props" | ({route, params, routes, paths}) => vNode |  | - |
| params | 路由的参数 | object |  | - |
| routes | router 的路由栈信息 | object\[] |  | - |
| separator | 分隔符自定义 | string\|slot |  | '/' |

### 和 browserHistory 配合

和 vue-router 一起使用时，默认生成的 url 路径是带有 `#` 的，如果和 browserHistory 一起使用的话，你可以使用 `itemRender` 属性定义面包屑链接。

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
