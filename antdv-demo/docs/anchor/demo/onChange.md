<cn>
#### 监听锚点链接改变
监听锚点链接改变
</cn>

<us>
#### Listening for anchor link change
Listening for anchor link change.
</us>

```vue
<template>
  <a-anchor :affix="false" @change="onChange">
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
    onChange(link) {
      console.log('Anchor:OnChange', link);
    },
  },
};
</script>
```
