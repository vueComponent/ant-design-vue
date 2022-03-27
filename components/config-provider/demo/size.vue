<docs>
---
order: 2
title:
  zh-CN: 组件尺寸
  en-US: Component size
---

## zh-CN

修改默认组件尺寸。

## en-US

Config component default size.

</docs>

<template>
  <a-radio-group v-model:value="componentSize">
    <a-radio-button value="small">Small</a-radio-button>
    <a-radio-button value="middle">Middle</a-radio-button>
    <a-radio-button value="large">Large</a-radio-button>
  </a-radio-group>
  <a-divider />
  <a-config-provider :component-size="componentSize">
    <div class="example">
      <a-input />
    </div>
    <div class="example">
      <a-tabs>
        <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </div>
    <div class="example">
      <a-input-search allow-clear />
    </div>
    <div class="example">
      <a-textarea allow-clear />
    </div>
    <div class="example">
      <a-select style="width: 100px" placeholder="select value" :options="[{ value: 'demo' }]" />
    </div>
    <div class="example">
      <a-datePicker />
    </div>
    <div class="example">
      <a-range-picker />
    </div>
    <div class="example">
      <a-button>Button</a-button>
    </div>
    <div class="example">
      <a-card title="Card">
        <a-table :columns="columns" :data-source="dataSource" />
      </a-card>
    </div>
  </a-config-provider>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const componentSize = ref('small');
    const columns = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Age', dataIndex: 'age' },
    ];
    const dataSource = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
      },
    ];
    return {
      componentSize,
      columns,
      dataSource,
    };
  },
});
</script>
<style scoped>
.example {
  margin: 16px 0;
}
</style>
