
<cn>
#### 自定义位置
使用 `style.top` 或配合其他样式来设置对话框位置。
</cn>

<us>
#### To customize the position of modal
You can use `style.top` or other styles to set position of modal dialog.
</us>

```html
<template>
  <div>
    <a-button type="primary" @click="() => setModal1Visible(true)">Display a modal dialog at 20px to Top</a-button>
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
    <a-button type="primary" @click="() => modal2Visible = true">Vertically centered modal dialog</a-button>
    <a-modal
      title="Vertically centered modal dialog"
      wrapClassName="vertical-center-modal"
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
    }
  },
  methods: {
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
  }
}
</script>
<style>
/* use css to set position of modal */
.vertical-center-modal {
  text-align: center;
  white-space: nowrap;
}

.vertical-center-modal:before {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  width: 0;
}

.vertical-center-modal .ant-modal {
  display: inline-block;
  vertical-align: middle;
  top: 0;
  text-align: left;
}

/*
// Use flex which not working in IE
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-center-modal .ant-modal {
  top: 0;
}
*/
</style>
```

