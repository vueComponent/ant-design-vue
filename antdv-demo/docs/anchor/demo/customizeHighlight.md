<cn>
#### 自定义锚点高亮
自定义锚点高亮。
</cn>

<us>
#### Customize the anchor highlight
Customize the anchor highlight.
</us>

```vue
<template>
  <a-anchor :affix="false" :get-current-anchor="getCurrentAnchor">
    <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
    <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
    <a-anchor-link href="#API" title="API">
      <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
      <a-anchor-link href="#Link-Props" title="Link Props" />
    </a-anchor-link>
  </a-anchor>
</template>
<script>
export default {
  methods: {
    getCurrentAnchor() {
      return '#components-anchor-demo-static';
    },
  },
};
</script>
```
