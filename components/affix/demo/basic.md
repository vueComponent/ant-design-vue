<cn>
#### 基本
最简单的用法。
</cn>

<us>
#### basic
The simplest usage.
</us>

```tpl
<template>
  <div>
    <a-affix :offsetTop="this.top">
      <a-button type="primary" @click="()=>{this.top += 10}">Affix top</a-button>
    </a-affix>
    <br />
    <a-affix :offsetBottom="this.bottom">
      <a-button type="primary" @click="()=>{this.bottom += 10}">Affix bottom</a-button>
    </a-affix>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        top: 10,
        bottom: 10,
      };
    },
  };
</script>
```
