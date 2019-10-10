<cn>
#### Info
展示处理结果。
</cn>

<us>
#### Info
Show processing results.
</us>

```tpl
<template>
  <a-result title="Your operation has been executed">
    <template v-slot:extra>
      <a-button type="primary" key="console">
        Go Console
      </a-button>
    </template>
  </a-result>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
  };
</script>
```
