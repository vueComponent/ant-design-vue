<cn>
#### 基本
最简单的用法。
</cn>

<us>
#### basic
The simplest usage.
</us>

```vue
<template>
  <div>
    <a-affix :offset-top="top">
      <a-button type="primary" @click="top += 10">
        Affix top
      </a-button>
    </a-affix>
    <br />
    <a-affix :offset-bottom="bottom">
      <a-button type="primary" @click="bottom += 10">
        Affix bottom
      </a-button>
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
