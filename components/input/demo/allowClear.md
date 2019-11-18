<cn>
#### 带移除图标
带移除图标的输入框，点击图标删除所有内容。
</cn>

<us>
#### With clear icon
Input type of password.
</us>

```tpl
<template>
  <a-input placeholder="input with clear icon" allowClear @change="onChange" />
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
