<docs>
---
order: 2
title:
  zh-CN: 自定义页脚
  en-US: Customized Footer
---

## zh-CN

更复杂的例子，自定义了页脚的按钮，点击提交后进入 loading 状态，完成后关闭。
不需要默认确定取消按钮时，你可以把 `footer` 设为 `null`。

## en-US

A more complex example which define a customized footer button bar,
the dialog will change to loading state after clicking submit button, when the loading is over,
the modal dialog will be closed.
You could set `footer` to `null` if you don't need default footer buttons.

</docs>

<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>
    <a-modal v-model:visible="visible" title="Title" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const loading = ref<boolean>(false);
    const visible = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        visible.value = false;
      }, 2000);
    };

    const handleCancel = () => {
      visible.value = false;
    };
    return {
      loading,
      visible,
      showModal,
      handleOk,
      handleCancel,
    };
  },
});
</script>
