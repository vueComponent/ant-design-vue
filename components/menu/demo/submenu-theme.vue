<docs>
---
order: 2
title:
  zh-CN: 子菜单主题
  en-US: SubMenu theme
---

## zh-CN

你可以通过 `theme` 属性来设置 SubMenu 的主题从而达到不同目录树下不同主题色的效果。该例子默认为根目录深色，子目录浅色效果。

## en-US

You can config SubMenu theme with `theme` prop to enable different theme color effect. This sample is dark for root and light for SubMenu.

</docs>

<template>
  <div>
    <a-switch
      :checked="theme === 'dark'"
      checked-children="dark"
      un-checked-children="light"
      @Change="changeTheme"
    />
    <br />
    <br />
    <a-menu
      :style="{ width: '256px' }"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      mode="vertical"
      theme="dark"
      :items="items"
      @click="handleClick"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, VueElement, ComputedRef, h } from 'vue';
import { MailOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);
const theme = ref<MenuProps['theme']>('light');

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: MenuProps['items'],
  theme?: 'light' | 'dark',
): MenuProps['items'][number] {
  return {
    key,
    icon,
    children,
    label,
    theme,
  };
}

const items: ComputedRef<MenuProps['items']> = computed(() => [
  getItem(
    'Navigation One',
    'sub1',
    h(MailOutlined),
    [getItem('Option 1', '1'), getItem('Option 2', '2'), getItem('Option 3', '3')],
    theme.value,
  ),
  getItem('Option 5', '5'),
  getItem('Option 6', '6'),
]);

function handleClick(info: any) {
  console.log('click', info);
}

function changeTheme(checked: boolean) {
  theme.value = checked ? 'dark' : 'light';
}
</script>
