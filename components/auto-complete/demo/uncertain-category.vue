<docs>
---
order: 5
title:
  zh-CN: 查询模式 - 不确定类目
  en-US: Lookup-Patterns - Uncertain Category
---

## zh-CN

查询模式 - 不确定类目。

## en-US

Lookup-Patterns - Uncertain Category.
</docs>

<template>
  <div class="global-search-wrapper" style="width: 300px">
    <a-auto-complete
      v-model:value="value"
      class="global-search"
      size="large"
      style="width: 100%"
      option-label-prop="title"
      :options="dataSource"
      @select="onSelect"
      @search="handleSearch"
    >
      <template #option="item">
        Found {{ item.query }} on
        <a
          :href="`https://s.taobao.com/search?q=${item.query}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.category }}
        </a>
        <span class="global-search-item-count">{{ item.count }} results</span>
      </template>
      <a-input-search size="large" placeholder="input here" enter-button></a-input-search>
    </a-auto-complete>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  query: string;
  category: string;
  value: string;
  count: number;
}
export default defineComponent({
  setup() {
    const value = ref('');
    const dataSource = ref<Option[]>([]);
    const onSelect = (value: string) => {
      console.log('onSelect', value);
    };

    const getRandomInt = (max: number, min = 0) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const searchResult = (query: string): Option[] => {
      return new Array(getRandomInt(5))
        .join('.')
        .split('.')
        .map((_item, idx) => ({
          query,
          category: `${query}${idx}`,
          value: `${query}${idx}`,
          count: getRandomInt(200, 100),
        }));
    };
    const handleSearch = (val: string) => {
      dataSource.value = val ? searchResult(val) : [];
    };
    return {
      value,
      dataSource,
      onSelect,
      handleSearch,
    };
  },
});
</script>

<style>
.global-search-wrapper {
  padding-right: 50px;
}

.global-search {
  width: 100%;
}

.global-search.ant-select-auto-complete .ant-select-selection--single {
  margin-right: -46px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
  padding-right: 62px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.global-search-item {
  display: flex;
}

.global-search-item-desc {
  flex: auto;
  text-overflow: ellipsis;
  overflow: hidden;
}

.global-search-item-count {
  flex: none;
}
</style>
