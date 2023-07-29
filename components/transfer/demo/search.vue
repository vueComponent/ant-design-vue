<docs>
---
order: 2
title:
  zh-CN: 带搜索框
  en-US: Search
---

## zh-CN

带搜索框的穿梭框，可以自定义搜索函数。

## en-US

Transfer with a search box.

</docs>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    show-search
    :filter-option="filterOption"
    :render="item => item.title"
    @change="handleChange"
    @search="handleSearch"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
interface MockData {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}
const mockData = ref<MockData[]>([]);

const targetKeys = ref<string[]>([]);
onMounted(() => {
  getMock();
});
const getMock = () => {
  const keys = [];
  const mData = [];
  for (let i = 0; i < 20; i++) {
    const data = {
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      chosen: Math.random() * 2 > 1,
    };
    if (data.chosen) {
      keys.push(data.key);
    }
    mData.push(data);
  }
  mockData.value = mData;
  targetKeys.value = keys;
};
const filterOption = (inputValue: string, option: MockData) => {
  return option.description.indexOf(inputValue) > -1;
};
const handleChange = (keys: string[], direction: string, moveKeys: string[]) => {
  console.log(keys, direction, moveKeys);
};

const handleSearch = (dir: string, value: string) => {
  console.log('search:', dir, value);
};
</script>
