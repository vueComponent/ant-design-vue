<cn>
#### 尺寸
选择器有三种尺寸：大、默认（中）、小。
</cn>

<us>
#### Size
There are three size of ColorPicker: large, medium(default), small.
</us>

```vue
<template>
  <div>
    <a-row>
      <a-col span="8">
        <a-colorPicker v-model="color6" size="large" />
      </a-col>
      <a-col span="8">
        <a-colorPicker v-model="color6" />
      </a-col>
      <a-col span="8">
        <a-colorPicker v-model="color6" size="small" />
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      color6: '#1890ff',
    };
  },
};
</script>
```
