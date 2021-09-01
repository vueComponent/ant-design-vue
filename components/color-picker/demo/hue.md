<cn>
#### 色彩
设置属性 `hue` 为 false，可以禁用色彩选项。
</cn>

<us>
#### Hue
Set property `hue` to false, can hide hue slider.
</us>

```vue
<template>
  <a-color-picker v-model="color" :hue="false" />
</template>
<script>
export default {
  data() {
    return {
      color: '#1890ff',
    };
  },
};
</script>
```
