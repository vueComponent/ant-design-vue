<cn>
#### 带面包屑页头
带面包屑页头，适合层级比较深的页面，让用户可以快速导航。
</cn>

<us>
#### Use with breadcrumbs
With breadcrumbs, it is suitable for deeper pages, allowing users to navigate quickly.
</us>

```html
<template>
  <a-page-header title="Title" :breadcrumb="{routes}" subTitle="This is a subtitle" />
</template>
<script>
  export default {
    data() {
      return {
        routes: [
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
        ],
      };
    },
  };
</script>
```
