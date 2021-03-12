<cn>
  #### vue-router
和 `vue-router` 进行结合使用。
</cn>

<us>
  #### Vue Router Integration
Used together with `vue-router`
</us>

```vue
<template>
  <div>
    <a-breadcrumb :routes="routes">
      <template slot="itemRender" slot-scope="{ route, params, routes, paths }">
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
<script>
export default {
  data() {
    const { lang } = this.$route.params;
    return {
      basePath: '/components/breadcrumb',
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
