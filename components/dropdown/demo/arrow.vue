<docs>
---
order: 2
title:
  zh-CN: 箭头
  en-US: Arrow
---

## zh-CN

可以展示一个箭头。

## en-US

You could display an arrow.

</docs>

<template>
  <a-space style="display: flex; flex-wrap: wrap">
    <template v-for="placement in placements" :key="placement">
      <a-dropdown :placement="placement" arrow>
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
