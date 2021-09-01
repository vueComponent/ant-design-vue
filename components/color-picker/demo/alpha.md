<cn>
#### 透明度
开启属性 `alpha`，可以选择带 Alpha 通道的颜色。
</cn>

<us>
#### Alpha
Set the property `alpha` true, to select a color with alpha channel.
</us>

```vue
<template>
  <a-color-picker v-model="color" :alpha="true" />
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
