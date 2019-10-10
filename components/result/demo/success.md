<cn>
#### Success
成功的结果。
</cn>

<us>
#### Success
Show successful results.
</us>

```tpl
<template>
  <a-result 
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
  >
    <template v-slot:extra>
      <a-button type="primary" key="console">Go Console</a-button>
      <a-button key="buy">Buy Again</a-button>
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
