<docs>
---
order: 13
title:
  zh-CN: 自定义渲染对话框
  en-US: Custom modal content render
debugger: true
---

## zh-CN

自定义渲染对话框, 可通过 `react-draggable` 来实现拖拽。

## en-US

Custom modal content render. use `react-draggable` implements draggable.

</docs>

<template>
  <div>
    <a-button type="primary" @click="showModal">Open Draggable Modal</a-button>
    <a-modal v-model:visible="visible" @ok="handleOk">
      <template #title>
        <div
          class="drag"
          style="width: 100%; cursor: move"
          @mouseover="handleMouseover"
          @mouseout="handleMouseout"
          @focus="() => {}"
          @blur="() => {}"
        >
          Draggable Modal
        </div>
      </template>
      <p>
        Just don&apos;t learn physics at school and your life will be full of magic and miracles.
      </p>
      <br />
      <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
      <template #modalRender="{ originVNode }">
        <VueDragResize is-active drag-handle=".drag" :is-resizable="false">
          <component :is="originVNode"></component>
        </VueDragResize>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueDragResize from 'vue-drag-resize';
export default defineComponent({
  components: {
    VueDragResize,
  },
  setup() {
    const visible = ref<boolean>(false);
    const draggleRef = ref();
    const disabled = ref(true);
    const bounds = ref({ left: 0, top: 0, width: 520, height: 0 });
    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };

    const onStart = (event, uiData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.value?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      bounds.value = {
        left: `${-targetRect.left + uiData.x}px`,
        right: `${clientWidth - (targetRect.right - uiData.x)}`,
        top: `${-targetRect.top + uiData.y}`,
        bottom: `${clientHeight - (targetRect.bottom - uiData.y)}`,
      };
    };
    return {
      visible,
      showModal,
      handleOk,
      onStart,
      handleMouseover() {
        if (disabled.value) {
          disabled.value = false;
        }
      },
      handleMouseout() {
        disabled.value = true;
      },
    };
  },
});
</script>
