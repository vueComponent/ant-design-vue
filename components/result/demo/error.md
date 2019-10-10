<cn>
#### Error
复杂的错误反馈。
</cn>

<us>
#### Error
Complex error feedback.
</us>

```tpl
<template>
  <a-result 
    status="error"
    title="Submission Failed"
    subTitle="Please check and modify the following information before resubmitting."
  >
    <template v-slot:extra>
      <a-button type="primary" key="console">
        Go Console
      </a-button>
      <a-button key="buy">
        Buy Again
      </a-button>
    </template>

    <div class="desc">
      <p style="font-size: 16px;"><strong>The content you submitted has the following error:</strong></p>
      <p><a-icon :style="{ color: 'red' }" type="close-circle" /> Your account has been frozen <a>Thaw immediately &gt;</a></p>
      <p><a-icon :style="{ color: 'red' }" type="close-circle" /> Your account is not yet eligible to apply <a>Apply Unlock &gt;</a></p>
    </div>
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
<style scoped>
.desc p {
    margin-bottom: 1em;
}
</style>
```
