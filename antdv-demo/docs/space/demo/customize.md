<cn>
#### 自定义尺寸
自定义间距大小。
</cn>

<us>
#### Customize Size
Custom spacing size.
</us>

```vue
<template>
  <div>
    <a-slider v-model="size" />
    <br />
    <br />
    <a-space :size="size">
      <a-button type="primary">Primary</a-button>
      <a-button>Default</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="link">Link</a-button>
    </a-space>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: 8,
    };
  },
};
</script>
```
