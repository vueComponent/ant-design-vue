<docs>
---
order: 13
title:
  zh-CN: 自定义渲染对话框
  en-US: Custom modal content render
---

## zh-CN

自定义渲染对话框, 可通过 `vueuse` 来实现拖拽。

## en-US

Custom modal content render. use `vueuse` implements draggable.

</docs>
<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
      ref="modalRef"
      v-model:visible="visible"
      :wrap-style="{ overflow: 'hidden' }"
      @ok="handleOk"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">Draggable Modal</div>
      </template>
      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, CSSProperties, watch, watchEffect } from 'vue';
import { useDraggable } from '@vueuse/core';
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false);
    const modalTitleRef = ref<HTMLElement>(null);
    const showModal = () => {
      visible.value = true;
    };
    const { x, y, isDragging } = useDraggable(modalTitleRef);
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };
    const startX = ref<number>(0);
    const startY = ref<number>(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = modalTitleRef.value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }
      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });

    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
          startY.value;
      }
    });
    const transformStyle = computed<CSSProperties>(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });
    return {
      visible,
      showModal,
      handleOk,
      modalTitleRef,
      transformStyle,
    };
  },
});
</script>
