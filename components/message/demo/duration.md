<cn>
#### 修改延时
自定义时长 `10s`，默认时长为 `3s`。
</cn>

<us>
#### Customize duration
Customize message display duration from default `3s` to `10s`.
</us>

```tpl
<template>
  <a-button @click="success">Customized display duration</a-button>
</template>
<script>
  export default {
    methods: {
      success() {
        this.$message.success(
          'This is a prompt message for success, and it will disappear in 10 seconds',
          10,
        );
      },
    },
  };
</script>
```
