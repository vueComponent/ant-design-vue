<docs>
---
order: 4
title:
  zh-CN: 查询模式 - 确定类目
  en-US: Lookup-Patterns - Certain Category
---

## zh-CN

查询模式 - 确定类目。

## en-US

Lookup-Patterns - Certain Category.
</docs>

<template>
  <div class="certain-category-search-wrapper" style="width: 250px">
    <a-auto-complete
      v-model:value="value"
      class="certain-category-search"
      dropdown-class-name="certain-category-search-dropdown"
      :dropdown-match-select-width="false"
      :dropdown-style="{ width: '300px' }"
      size="large"
      style="width: 100%"
      option-label-prop="value"
      :options="dataSource"
    >
      <template #option="item">
        <template v-if="item.options">
          <span>
            {{ item.value }}
            <a
              style="float: right"
              href="https://www.google.com/search?q=antd"
              target="_blank"
              rel="noopener noreferrer"
            >
              more
            </a>
          </span>
        </template>
        <template v-else-if="item.value === 'all'">
          <a
            href="https://www.google.com/search?q=ant-design-vue"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all results
          </a>
        </template>
        <template v-else>
          {{ item.title }}
          <span class="certain-search-item-count">{{ item.count }} people</span>
        </template>
      </template>
      <a-input placeholder="input here">
        <template #suffix><search-outlined class="certain-category-icon" /></template>
      </a-input>
    </a-auto-complete>
  </div>
</template>

<script lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
const dataSource = [
  {
    value: 'Libraries',
    options: [
      {
        value: 'AntDesign',
        count: 10000,
      },
      {
        value: 'AntDesign UI',
        count: 10600,
      },
    ],
  },
  {
    value: 'Solutions',
    options: [
      {
        value: 'AntDesign UI FAQ',
        count: 60100,
      },
      {
        value: 'AntDesign FAQ',
        count: 30010,
      },
    ],
  },
  {
    value: 'Articles',
    options: [
      {
        value: 'AntDesign design language',
        count: 100000,
      },
    ],
  },
  {
    value: 'all',
  },
];
export default defineComponent({
  components: {
    SearchOutlined,
  },
  setup() {
    return {
      value: ref(''),
      dataSource,
    };
  },
});
</script>

<style>
.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
  border-bottom: 1px solid #f6f6f6;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item {
  padding-left: 16px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .ant-select-dropdown-menu {
  max-height: 300px;
}
</style>

<style scoped>
.certain-category-search-wrapper
  :deep(.certain-category-search.ant-select-auto-complete)
  .ant-input-affix-wrapper
  .ant-input-suffix {
  right: 12px;
}
.certain-category-search-wrapper :deep(.certain-search-item-count) {
  position: absolute;
  color: #999;
  right: 16px;
}
.certain-category-search-wrapper
  :deep(.certain-category-search.ant-select-focused)
  .certain-category-icon {
  color: #108ee9;
}
.certain-category-search-wrapper :deep(.certain-category-icon) {
  color: #6e6e6e;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-size: 16px;
}
</style>
