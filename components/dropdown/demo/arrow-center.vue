<docs>
---
order: 3
title:
  zh-CN: 箭头指向
  en-US: Arrow pointing at the center
---

## zh-CN

设置 `arrow` 为 `{ pointAtCenter: true }` 后，箭头将指向目标元素的中心。

## en-US

By specifying `arrow` prop with `{ pointAtCenter: true }`, the arrow will point to the center of the target element.

</docs>

<template>
  <a-space style="display: flex; flex-wrap: wrap">
    <template v-for="placement in placements" :key="placement">
      <a-dropdown :placement="placement" :arrow="{ pointAtCenter: true }">
        <a-button>{{ placement }}</a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-space>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    return {
      placements: ['topLeft', 'top', 'topRight', 'bottomLeft', 'bottom', 'bottomRight'] as const,
    };
  },
});
</script>
