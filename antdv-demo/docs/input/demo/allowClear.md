<cn>
#### 带移除图标
带移除图标的输入框，点击图标删除所有内容。
</cn>

<us>
#### With clear icon
Input type of password.
</us>

```vue
<template>
  <div>
    <a-input placeholder="input with clear icon" allow-clear @change="onChange" />
    <br />
    <br />
    <a-textarea placeholder="textarea with clear icon" allow-clear @change="onChange" />
  </div>
</template>
<script>
export default {
  methods: {
    onChange(e) {
      console.log(e);
    },
  },
};
</script>
```
