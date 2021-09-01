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
    >
      <template #dataSource>
        <a-select-opt-group v-for="group in dataSource" :key="group.title">
          <template #label>
            <span>
              {{ group.title }}
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
          <a-select-option v-for="opt in group.children" :key="opt.title" :value="opt.title">
            {{ opt.title }}
            <span class="certain-search-item-count">{{ opt.count }} people</span>
          </a-select-option>
        </a-select-opt-group>
        <a-select-option key="all" disabled class="show-all">
          <a
            href="https://www.google.com/search?q=ant-design-vue"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all results
          </a>
        </a-select-option>
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
    title: 'Libraries',
    children: [
      {
        title: 'AntDesign',
        count: 10000,
      },
      {
        title: 'AntDesign UI',
        count: 10600,
      },
    ],
  },
  {
    title: 'Solutions',
    children: [
      {
        title: 'AntDesign UI FAQ',
        count: 60100,
      },
      {
        title: 'AntDesign FAQ',
        count: 30010,
      },
    ],
  },
  {
    title: 'Articles',
    children: [
      {
        title: 'AntDesign design language',
        count: 100000,
      },
    ],
  },
];
export default defineComponent({
  setup() {
    return {
      value: ref(''),
      dataSource,
    };
  },
  components: {
    SearchOutlined,
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
