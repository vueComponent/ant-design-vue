<cn>
#### Promise 接口
可以通过 then 接口在关闭后运行 callback 。以上用例将在每个 message 将要结束时通过 then 显示新的 message 。
</cn>

<us>
#### Promise interface
`message` provides promise interface for `onClose`. The above example will display a new message when old message is about to finish.
</us>

```tpl
<template>
  <a-button @click="success">Display a sequence of message</a-button>
</template>
<script>
  export default {
    methods: {
      success() {
        this.$message
          .loading('Action in progress..', 2.5)
          .then(() => this.$message.success('Loading finished', 2.5))
          .then(() => this.$message.info('Loading finished is finished', 2.5));
      },
    },
  };
</script>
```
