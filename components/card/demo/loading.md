<cn>
  #### 预加载的卡片
  数据读入前会有文本块样式
</cn>

<us>
  #### Loading card
  Shows a loading indirector while the contents of the card is being featched
</us>

```tpl
<template>
  <div>
    <a-card :loading="loading" title="Card title">
      whatever content
    </a-card>
    <a-button @click="handleClick" style="marginTop: 16px">Toggle loading</a-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
      };
    },
    methods: {
      handleClick() {
        this.loading = !this.loading;
      },
    },
  };
</script>
```
