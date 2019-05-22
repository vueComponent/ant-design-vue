
<cn>
#### 全局加载蒙层
使用 `loading()` 可以快捷地弹出全局加载蒙层。
</cn>

<us>
#### Global loading mask
To use `loading()` to popup a global loading mask.
</us>

```html
<template>
  <div>
    <a-button @click="showLoading">
      Loading
    </a-button>
  </div>
</template>
<script>
export default {
  methods: {
    showLoading() {
      const loading = this.$loading();

      setTimeout(() => {
        loading.update({
          tip: 'loading...',
        });
      }, 1000);

      setTimeout(() => {
        loading.destroy();
      }, 2000);
    },
  },
};
</script>
```
