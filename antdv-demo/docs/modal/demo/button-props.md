<cn>
#### 自定义页脚按钮属性
传入 `okButtonProps` 和 `cancelButtonProps` 可分别自定义确定按钮和取消按钮的 props。
</cn>

<us>
#### Customize footer buttons props
Passing `okButtonProps` and `cancelButtonProps` can customize the ok button and cancel button props.
</us>

```vue
<template>
  <div>
    <a-button type="primary" @click="showModal">
      Open Modal with customized button props
    </a-button>
    <a-modal
      v-model="visible"
      title="Basic Modal"
      :ok-button-props="{ props: { disabled: true } }"
      :cancel-button-props="{ props: { disabled: true } }"
      @ok="handleOk"
    >
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
    handleCancel(e) {
      console.log(e);
      this.visible = false;
    },
  },
};
</script>
```
