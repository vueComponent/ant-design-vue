<docs>
---
order: 7
title:
  zh-CN: 自定义位置
  en-US: To customize the position of modal
---

## zh-CN

使用 `centered` 或类似 `style.top` 的样式来设置对话框位置。

## en-US

You can use `centered`,`style.top` or other styles to set position of modal dialog.

</docs>

<template>
  <div id="components-modal-demo-position">
    <a-button type="primary" @click="setModal1Visible(true)">
      Display a modal dialog at 20px to Top
    </a-button>
    <a-modal
      v-model:visible="modal1Visible"
      title="20px to Top"
      style="top: 20px"
      @ok="setModal1Visible(false)"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
    <br />
    <br />
    <a-button type="primary" @click="modal2Visible = true">
      Vertically centered modal dialog
    </a-button>
    <a-modal
      v-model:visible="modal2Visible"
      title="Vertically centered modal dialog"
      centered
      @ok="modal2Visible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const modal1Visible = ref<boolean>(false);
    const modal2Visible = ref<boolean>(false);

    const setModal1Visible = (visible: boolean) => {
      modal1Visible.value = visible;
    };
    return {
      modal1Visible,
      modal2Visible,
      setModal1Visible,
    };
  },
});
</script>
