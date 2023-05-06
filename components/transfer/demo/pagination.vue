<docs>
---
order: 5
title:
  zh-CN: 分页
  en-US: Pagination
---

## zh-CN

大数据下使用分页。

## en-US

large count of items with pagination.

</docs>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :render="item => item.title"
      :disabled="disabled"
      pagination
      @change="handleChange"
    />
    <a-switch
      v-model:checked="disabled"
      un-checked-children="enabled"
      checked-children="disabled"
      style="margin-top: 16px"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface MockData {
  key: string;
  title: string;
  description: string;
}
const mockData: MockData[] = [];
for (let i = 0; i < 200; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
  });
}

const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const disabled = ref<boolean>(false);

const targetKeys = ref<string[]>(oriTargetKeys);

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  console.log('targetKeys: ', nextTargetKeys);
  console.log('direction: ', direction);
  console.log('moveKeys: ', moveKeys);
};
</script>
