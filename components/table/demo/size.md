<cn>
#### 紧凑型
两种紧凑型的列表，小型列表只用于对话框内。
</cn>

<us>
#### size
Two compacted table size: `middle` and `small`, `small` size is used in Modal only.
</us>

```tpl
<template>
  <div id="components-table-demo-size">
    <h4>Middle size table</h4>
    <a-table :columns="columns" :dataSource="data" size="middle" />
    <h4>Small size table</h4>
    <a-table :columns="columns" :dataSource="data" size="small" />
  </div>
</template>
<script>
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  export default {
    data() {
      return {
        data,
        columns,
      };
    },
  };
</script>
<style>
  #components-table-demo-size h4 {
    margin-bottom: 16px;
  }
</style>
```
