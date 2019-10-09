<cn>
#### 自定义提示
使用 `tipFormatter` 可以格式化 `Tooltip` 的内容，设置 `tipFormatter={null}`，则隐藏 `Tooltip`。
</cn>

<us>
#### Customize tooltip
Use `tipFormatter` to format content of `Toolip`. If `tipFormatter` is null, hide it.
</us>

```tpl
<template>
  <div>
    <a-slider :tipFormatter="formatter" />
    <a-slider :tipFormatter="null" />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        disabled: false,
      };
    },
    methods: {
      formatter(value) {
        return `${value}%`;
      },
    },
  };
</script>
```
