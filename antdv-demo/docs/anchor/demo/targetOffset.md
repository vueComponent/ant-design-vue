<cn>
#### 设置锚点滚动偏移量
锚点目标滚动到屏幕正中间。
</cn>

<us>
#### Set Anchor scroll offset
Anchor target scroll to screen center.
</us>

```vue
<template>
  <a-anchor :target-offset="targetOffset">
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
  data() {
    return {
      targetOffset: undefined,
    };
  },
  mounted() {
    this.targetOffset = window.innerHeight / 2;
  },
};
</script>
```
