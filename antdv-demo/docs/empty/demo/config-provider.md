<cn>
#### 全局化配置
自定义全局组件的 Empty 样式。
</cn>

<us>
#### ConfigProvider
Use ConfigProvider set global Empty style.
</us>

```vue
<template>
  <div>
    <a-switch
      un-checked-children="default"
      checked-children="customize"
      :checked="customize"
      @change="val => (customize = val)"
    />

    <a-divider />
    <a-config-provider>
      <template v-if="customize" #renderEmpty>
        <div style="text-align: center">
          <a-icon type="smile" style="font-size: 20px" />
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      customize: false,
      style: { width: '200px' },
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
      ],
    };
  },
};
</script>
<style>
.code-box-demo .config-provider h3 {
  font-size: inherit;
  margin: 16px 0 8px 0;
}
</style>
```
