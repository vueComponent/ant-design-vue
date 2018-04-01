<cn>
#### template 风格的 API
使用 template 风格的 API
> 这个只是一个描述 `columns` 的语法糖，所以你不能用其他组件去包裹 `Column` 和 `ColumnGroup`。
</cn>

<us>
#### template style API
Using template style API
> Since this is just a syntax sugar for the prop `columns`, so that you can't compose `Column` and `ColumnGroup` with other Components.
</us>

```html
<template>
  <a-table :dataSource="data">
    <a-table-column-group>
      <span slot="title" style="color: #1890ff">Name</span>
      <a-table-column
        dataIndex="firstName"
        key="firstName"
      >
        <span slot="title" style="color: #1890ff">First Name</span>
      </a-table-column>
      <a-table-column
        title="Last Name"
        dataIndex="lastName"
        key="lastName"
      />
    </a-table-column-group>
    <a-table-column
      title="Age"
      dataIndex="age"
      key="age"
    />
    <a-table-column
      title="Address"
      dataIndex="address"
      key="address"
    />
    <a-table-column
      title="Action"
      key="action"
    >
      <template slot-scope="text, record">
        <span>
          <a href="#">Action 一 {{record.firstName}}</a>
          <a-divider type="vertical" />
          <a href="#">Delete</a>
          <a-divider type="vertical" />
          <a href="#" class="ant-dropdown-link">
            More actions <a-icon type="down" />
          </a>
        </span>
      </template>
    </a-table-column>
  </a-table>
</template>
<script>

const data = [{
  key: '1',
  firstName: 'John',
  lastName: 'Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  firstName: 'Jim',
  lastName: 'Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  firstName: 'Joe',
  lastName: 'Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default {
  data() {
    return {
      data,
    }
  }
}
</script>
```
