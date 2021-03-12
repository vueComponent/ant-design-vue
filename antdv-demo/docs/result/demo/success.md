<cn>
#### Success
成功的结果。
</cn>

<us>
#### Success
Show successful results.
</us>

```vue
<template>
  <a-result
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
  >
    <template #extra>
      <a-button key="console" type="primary">
        Go Console
      </a-button>
      <a-button key="buy">
        Buy Again
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
