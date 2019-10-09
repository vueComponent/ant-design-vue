<cn>
#### 不可用
Radio 不可用。
</cn>

<us>
#### disabled
Radio unavailable.
</us>

```tpl
<template>
  <div>
    <a-radio :defaultChecked="false" :disabled="disabled">Disabled</a-radio>
    <br />
    <a-radio defaultChecked :disabled="disabled">Disabled</a-radio>
    <div :style="{ marginTop: 20 }">
      <a-button type="primary" @click="toggleDisabled">
        Toggle disabled
      </a-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        disabled: true,
      };
    },
    methods: {
      toggleDisabled() {
        this.disabled = !this.disabled;
      },
    },
  };
</script>
```
