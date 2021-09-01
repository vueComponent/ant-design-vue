<docs>
---
order: 5
title:
  zh-CN: 国际化
  en-US: Internationalization
---

## zh-CN

设置 `okText` 与 `cancelText` 以自定义按钮文字。

## en-US

To customize the text of the buttons, you need to set `okText` and `cancelText` props.

</docs>

<template>
  <div>
    <a-button type="primary" @click="showModal">Modal</a-button>
    <a-button @click="confirm">Confirm</a-button>
    <a-modal
      v-model:visible="visible"
      title="Modal"
      ok-text="确认"
      cancel-text="取消"
      @ok="hideModal"
    >
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
      <p>Bla bla ...</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref, createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };
    const hideModal = () => {
      visible.value = false;
    };

    const confirm = () => {
      Modal.confirm({
        title: 'Confirm',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Bla bla ...',
        okText: '确认',
        cancelText: '取消',
      });
    };

    return {
      visible,
      showModal,
      hideModal,
      confirm,
    };
  },
});
</script>
