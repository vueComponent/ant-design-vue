<cn>
#### 选择图片
可以通过设置 `image` 为 `Empty.PRESENTED_IMAGE_SIMPLE` 选择另一种风格的图片。
</cn>

<us>
#### Chose image
You can choose another style of `image` by setting image to `Empty.PRESENTED_IMAGE_SIMPLE`.
</us>

```vue
<template>
  <a-empty :image="simpleImage" />
</template>
<script>
import { Empty } from 'ant-design-vue';
export default {
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
};
</script>
```
