<cn>
#### 基本
第一个对话框。
</cn>

<us>
#### Basic
Basic modal.
</us>

```tpl
<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal title="Basic Modal" v-model="visible" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      showModal() {
        this.visible = true;
      },
      handleOk(e) {
        console.log(e);
        this.visible = false;
      },
    },
  };
</script>
```
