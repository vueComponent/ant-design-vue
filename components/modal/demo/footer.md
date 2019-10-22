<cn>
#### 自定义页脚
更复杂的例子，自定义了页脚的按钮，点击提交后进入 loading 状态，完成后关闭。
不需要默认确定取消按钮时，你可以把 `footer` 设为 `null`。
</cn>

<us>
#### Customized Footer
A more complex example which define a customized footer button bar,
the dialog will change to loading state after clicking submit button, when the loading is over,
the modal dialog will be closed.
You could set `footer` to `null` if you don't need default footer buttons.
</us>

```tpl
<template>
  <div>
    <a-button type="primary" @click="showModal">
      Open Modal with customized footer
    </a-button>
    <a-modal v-model="visible" title="Title" onOk="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
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
        loading: false,
        visible: false,
      };
    },
    methods: {
      showModal() {
        this.visible = true;
      },
      handleOk(e) {
        this.loading = true;
        setTimeout(() => {
          this.visible = false;
          this.loading = false;
        }, 3000);
      },
      handleCancel(e) {
        this.visible = false;
      },
    },
  };
</script>
```
