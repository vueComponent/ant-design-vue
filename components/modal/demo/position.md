<cn>
#### 自定义位置
使用 `centered` 或类似 `style.top` 的样式来设置对话框位置。
</cn>

<us>
#### To customize the position of modal
You can use `centered`,`style.top` or other styles to set position of modal dialog.
</us>

```tpl
<template>
  <div id="components-modal-demo-position">
    <a-button type="primary" @click="() => setModal1Visible(true)"
      >Display a modal dialog at 20px to Top</a-button
    >
    <a-modal
      title="20px to Top"
      style="top: 20px;"
      :visible="modal1Visible"
      @ok="() => setModal1Visible(false)"
      @cancel="() => setModal1Visible(false)"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
    <br /><br />
    <a-button type="primary" @click="() => modal2Visible = true"
      >Vertically centered modal dialog</a-button
    >
    <a-modal
      title="Vertically centered modal dialog"
      centered
      v-model="modal2Visible"
      @ok="() => modal2Visible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal1Visible: false,
        modal2Visible: false,
      };
    },
    methods: {
      setModal1Visible(modal1Visible) {
        this.modal1Visible = modal1Visible;
      },
    },
  };
</script>
```
