<docs>
---
order: 1
title:
  zh-CN: 简单列表
  en-US: Simple list
---

## zh-CN

列表拥有大、中、小三种尺寸。
通过设置 `size` 为 `large` `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸为中。
可通过设置 `header` 和 `footer`，来自定义列表头部和尾部。

## en-US

Ant Design supports a default list size as well as a large and small size.
If a large or small list is desired, set the size property to either large or small respectively. Omit the size property for a list with the default size.
Customizing the header and footer of list by setting `header` and `footer` property.

</docs>

<template>
  <h3 :style="{ margin: '16px 0' }">Small Size</h3>
  <a-list size="small" bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
  <h3 :style="{ marginBottom: '16px' }">Default Size</h3>
  <a-list bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
  <h3 :style="{ margin: '16px 0' }">Large Size</h3>
  <a-list size="large" bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
const data: string[] = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];
</script>
