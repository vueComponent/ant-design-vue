<cn>
#### 自定义 click 事件
点击锚点不记录历史。
</cn>

<us>
#### Customize the click event
Clicking on an anchor does not record history.
</us>

```html
<template>
  <a-anchor :affix="false" @click="handleClick">
    <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
    <a-anchor-link href="#components-anchor-demo-static-anchor" title="Fixed demo" />
    <a-anchor-link href="#API" title="API">
      <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
      <a-anchor-link href="#Link-Props" title="Link Props" />
    </a-anchor-link>
  </a-anchor>
</template>
<script>
export default {
  methods: {
    handleClick (e, link) {
      e.preventDefault();
      console.log(link);
    }
  }
}
</script>
```
