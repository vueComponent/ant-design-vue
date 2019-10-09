<cn>
#### 其他提示类型
包括成功、失败、警告。
</cn>

<us>
#### Other types of message
Messages of success, error and warning types.
</us>

```tpl
<template>
  <div>
    <a-button @click="success">Success</a-button>
    <a-button @click="error">Error</a-button>
    <a-button @click="warning">Warning</a-button>
  </div>
</template>
<script>
  export default {
    methods: {
      success() {
        this.$message.success('This is a message of success');
      },
      error() {
        this.$message.error('This is a message of error');
      },
      warning() {
        this.$message.warning('This is message of warning');
      },
    },
  };
</script>
```
