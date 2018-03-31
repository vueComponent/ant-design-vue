<cn>
#### 基本用法
简单的表格，最后一列是各种操作。
</cn>

<us>
#### basic Usage
Simple table with actions.
</us>

```html
<template>
  <a-table :columns="columns" :dataSource="data" />
</template>
<script>
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default {
  data() {
    return {
      data,
      columns,
    }
  }
}
</script>
```
