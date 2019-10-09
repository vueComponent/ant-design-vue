<cn>
#### 包含子组件
加载占位图包含子组件。
</cn>

<us>
#### Contains sub component
Skeleton contains sub component.
</us>

```tpl
<template>
  <div class="article">
    <a-skeleton :loading="loading">
      <div>
        <h4>Ant Design Vue, a design language</h4>
        <p>
          We supply a series of design principles, practical patterns and high quality design
          resources (Sketch and Axure), to help people create their product prototypes beautifully
          and efficiently.
        </p>
      </div>
    </a-skeleton>
    <a-button @click="showSkeleton" :disabled="loading">
      Show Skeleton
    </a-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      showSkeleton() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      },
    },
  };
</script>
<style>
  .article h4 {
    margin-bottom: 16px;
  }
  .article button {
    margin-top: 16px;
  }
</style>
```
