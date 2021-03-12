<cn>
#### Info
展示处理结果。
</cn>

<us>
#### Info
Show processing results.
</us>

```vue
<template>
  <a-result title="Your operation has been executed">
    <template #extra>
      <a-button key="console" type="primary">
        Go Console
      </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
```
