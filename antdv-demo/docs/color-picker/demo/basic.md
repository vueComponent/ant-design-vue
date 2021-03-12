<cn>
#### 基础用法
基本用法，可以使用 v-model 实现数据的双向绑定。
</cn>

<us>
#### Basic
Basic usage. You can use v-model to enable a two-way bingding on data.
</us>

```vue
<template>
  <a-row>
    <a-col span="12">
      有默认值
      <a-colorPicker v-model="color1" />
    </a-col>
    <a-col span="12">
      无默认值
      <a-colorPicker v-model="color2" />
    </a-col>
  </a-row>
</template>
<script>
export default {
  data() {
    return {
      color1: '#1890ff',
      color2: '',
    };
  },
};
</script>
```
