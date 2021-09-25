<docs>
---
order: 4
title:
  zh-CN: 触发事件
  en-US: Click event
---

## zh-CN

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。

## en-US

An event will be triggered when you click menu items, in which you can make different operations according to item's key.

</docs>

<template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      Hover me, Click menu item
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu @click="onClick">
        <a-menu-item key="1">1st menu item</a-menu-item>
        <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
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
    const onClick = ({ key }: MenuInfo) => {
      console.log(`Click on item ${key}`);
    };
    return {
      onClick,
    };
  },
});
</script>
