<docs>
---
order: 3
title:
  zh-CN: 内联步骤条
  en-US: Inline Steps
---

## zh-CN

内联类型的步骤条，适用于列表内容场景中展示对象所在流程、当前状态的情况。

## en-US

Inline type steps, suitable for displaying the process and current state of the object in the list content scene.

</docs>

<template>
  <a-list :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <template #title>
            <a href="https://www.antdv.com/">{{ item.title }}</a>
          </template>
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-list-item-meta>
        <a-steps
          style="margin-top: 8px"
          type="inline"
          :current="item.current"
          :status="item.status"
          :items="items"
        />
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
const data = [
  {
    title: 'Ant Design Title 1',
    current: 0,
  },
  {
    title: 'Ant Design Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Ant Design Title 3',
    current: 2,
  },
  {
    title: 'Ant Design Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    description: 'This is a Step 1.',
  },
  {
    title: 'Step 2',
    description: 'This is a Step 2.',
  },
  {
    title: 'Step 3',
    description: 'This is a Step 3.',
  },
];
</script>
