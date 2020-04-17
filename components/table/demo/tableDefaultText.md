<cn>
#### 列表项存在空数据时默认显示
通过Table上的tableDefaultText属性可以当表格里有数据为空时默认显示tableDefaultText的值
通过columns的columnDefaultText属性可以自定义该列中数据为空时默认显示自定义columns中columnDefaultText的值，且优先级高于table
</cn>

<us>
#### List items appear by default when there is empty data
The tableDefaultText property on the Table can be used to display the value of tableDefaultText by default when the data in the table is empty.
The columnDefaultText property of the columns can be used to customize the default value of the columnDefaultText in the custom columns when the data in the column is empty
</us>

```html
<template>
  <a-table :columns="columns" :dataSource="data" tableDefaultText='无'>
    <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag v-for="tag in tags" color="blue" :key="tag">{{tag}}</a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a href="javascript:;">Invite 一 {{record.name}}</a>
      <a-divider type="vertical" />
      <a href="javascript:;">Delete</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        More actions <a-icon type="down" />
      </a>
    </span>
  </a-table>
</template>
<script>
const columns = [{
  dataIndex: 'name',
  key: 'name',
  slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' },
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
  columnDefaultText:'未填写地址'
}, {
  title: 'Tags',
  key: 'tags',
  dataIndex: 'tags',
  scopedSlots: { customRender: 'tags' },
}, {
  title: 'Action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: '',
  address: '',
  tags: ['cool', 'teacher'],
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