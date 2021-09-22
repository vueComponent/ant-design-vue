<docs>
---
order: 7
title:
  zh-CN: 菜单隐藏方式
  en-US: The way of hiding menu.
---

## zh-CN

默认是点击关闭菜单，可以关闭此功能。

## en-US

The default is to close the menu when you click on menu items, this feature can be turned off.

</docs>

<template>
  <a-dropdown v-model:visible="visible">
    <a class="ant-dropdown-link" @click.prevent>
      Hover me
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="1">Clicking me will not close the menu.</a-menu-item>
        <a-menu-item key="2">Clicking me will not close the menu also.</a-menu-item>
        <a-menu-item key="3">Clicking me will close the menu</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

interface MenuInfo {
  key: string;
  keyPath: string[];
  item: any;
  domEvent: MouseEvent;
}
export default defineComponent({
  components: {
    DownOutlined,
  },
  setup() {
    const visible = ref(false);
    const handleMenuClick = (e: MenuInfo) => {
      if (e.key === '3') {
        visible.value = false;
      }
    };
    return {
      visible,
      handleMenuClick,
    };
  },
});
</script>
