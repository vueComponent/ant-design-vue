<docs>
---
order: 4
title:
  zh-CN: 全局化配置
  en-US: ConfigProvider
---

## zh-CN

自定义全局组件的 Empty 样式。

## en-US

Use ConfigProvider set global Empty style.

</docs>

<template>
  <a-switch
    v-model:checked="customize"
    un-checked-children="default"
    checked-children="customize"
  />
  <a-divider />
  <a-config-provider>
    <template v-if="customize" #renderEmpty>
      <div style="text-align: center">
        <smile-outlined style="font-size: 20px" />
        <p>Data Not Found</p>
      </div>
    </template>
    <div class="config-provider">
      <h3>Select</h3>
      <a-select :style="style" :options="[]" />

      <h3>TreeSelect</h3>
      <a-tree-select :style="style" :tree-data="[]" />

      <h3>Cascader</h3>
      <a-cascader :style="style" :options="[]" :show-search="true" />

      <h3>Transfer</h3>
      <a-transfer :data-source="[]" />

      <h3>Table</h3>
      <a-table style="margin-top: 8px" :columns="columns" :data-source="[]" />
      <h3>List</h3>
      <a-list :data-source="[]" />
    </div>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { SmileOutlined } from '@ant-design/icons-vue';
const customize = ref<boolean>(false);

const style = { width: '200px' };
const columns = [{ title: 'Name' }, { title: 'Age' }];
</script>
<style scoped>
.code-box-demo .config-provider h3 {
  font-size: inherit;
  margin: 16px 0 8px 0;
}
</style>
