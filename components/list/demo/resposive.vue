<docs>
---
order: 5
title:
  zh-CN: 响应式的栅格列表
  en-US: Responsive grid list
---

## zh-CN

响应式的栅格列表。尺寸与 [Layout Grid](https://www.antdv.com/components/grid-cn/#Col) 保持一致。

## en-US

Responsive grid list. The size property is as same as [Layout Grid](https://www.antdv.com/components/grid/#Col).

</docs>

<template>
  <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card :title="item.title">Card content</a-card>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
interface DataItem {
  title: string;
}
const data: DataItem[] = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  },
  {
    title: 'Title 6',
  },
];

export default defineComponent({
  setup() {
    return {
      data,
    };
  },
});
</script>
