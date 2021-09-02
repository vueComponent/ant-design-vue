<docs>
---
order: 1
title:
  zh-CN: 异步关闭
  en-US: Asynchronously close
---

## zh-CN

点击确定后异步关闭对话框，例如提交表单。

## en-US

Asynchronously close a modal dialog when a user clicked OK button, for example,
you can use this pattern when you submit a form.

</docs>

<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal with async logic</a-button>
    <a-modal
      v-model:visible="visible"
      title="Title"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <p>{{ modalText }}</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const modalText = ref<string>('Content of the modal');
    const visible = ref<boolean>(false);
    const confirmLoading = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = () => {
      modalText.value = 'The modal will be closed after two seconds';
      confirmLoading.value = true;
      setTimeout(() => {
        visible.value = false;
        confirmLoading.value = false;
      }, 2000);
    };
    return {
      modalText,
      visible,
      confirmLoading,
      showModal,
      handleOk,
    };
  },
});
</script>
