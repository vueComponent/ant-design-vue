<cn>
#### 加载中
进行全局 loading，异步自行移除。
</cn>

<us>
#### Message of loading
Display a global loading indicator, which is dismissed by itself asynchronously.
</us>

```tpl
<template>
  <a-button @click="success">Display a loading indicator</a-button>
</template>
<script>
  export default {
    methods: {
      success() {
        const hide = this.$message.loading('Action in progress..', 0);
        setTimeout(hide, 2500);
      },
    },
  };
</script>
```
