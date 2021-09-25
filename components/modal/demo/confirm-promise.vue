<docs>
---
order: 9
title:
  zh-CN: 确认对话框(promise)
  en-US: Confirmation modal dialog use promise
---

## zh-CN

使用 `confirm()` 可以快捷地弹出确认框。onCancel/onOk 返回 promise 可以延迟关闭

## en-US

To use `confirm()` to popup confirmation modal dialog. Let onCancel/onOk function return a promise object to
delay closing the dialog.

</docs>

<template>
  <a-button @click="showConfirm">Confirm</a-button>
</template>
<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent } from 'vue';
import { Modal } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const showConfirm = () => {
      Modal.confirm({
        title: 'Do you want to delete these items?',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    };
    return {
      showConfirm,
    };
  },
});
</script>
