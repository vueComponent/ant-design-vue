<docs>
---
order: 10
title:
  zh-CN: 自定义模态的宽度
  en-US: To customize the width of modal
---

## zh-CN

使用`width`来设置模态对话框的宽度

## en-US

Use `width` to set the width of the modal dialog

</docs>

<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal of 1000px width</a-button>
    <a-modal v-model:visible="visible" width="1000px" title="Basic Modal" @ok="handleOk">
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
    const visible = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };
    return {
      visible,
      showModal,
      handleOk,
    };
  },
});
</script>
