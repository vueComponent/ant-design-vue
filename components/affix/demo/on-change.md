<cn>
#### 固定状态改变的回调
可以获得是否固定的状态。
</cn>

<us>
#### Callback
Callback with affixed state.
</us>

```tpl
<template>
  <a-affix :offsetTop="120" @change="change">
    <a-button>120px to affix top</a-button>
  </a-affix>
</template>
<script>
  export default {
    methods: {
      change(affixed) {
        console.log(affixed);
      },
    },
  };
</script>
```
