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

```vue
<template>
  <a-table :data-source="data">
    <a-table-column-group>
      <span slot="title" style="color: #1890ff">Name</span>
      <a-table-column key="firstName" data-index="firstName">
        <span slot="title" style="color: #1890ff">First Name</span>
      </a-table-column>
      <a-table-column
        key="lastName"
        title="Last Name"
        data-index="lastName"
        :filters="[
          { text: 'Brown', value: 'Brown' },
          { text: 'Green', value: 'Green' },
          { text: 'Black', value: 'Black' },
        ]"
        :defaultFilteredValue="['Brown', 'Green', 'Black']"
        :onFilter="(value, record) => record.lastName == value"
      />
    </a-table-column-group>
    <a-table-column key="age" title="Age" data-index="age" />
    <a-table-column key="address" title="Address" data-index="address" />
    <a-table-column
      key="tags"
      data-index="tags"
      :filteredValue="filteredTags"
      :onFilter="(value, record) => record.tags.includes(value)"
      :filterDropdownVisible="tagsFilterDropdownVisible"
      :onFilterDropdownVisibleChange="visible => (tagsFilterDropdownVisible = visible)"
    >
      <span slot="title"> Tags {{ tagsFilterDropdownVisible ? 'filtering' : '' }} </span>
      <template slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys }">
        <div style="background-color: white; border: solid;">
          <a-checkbox
            v-for="tag in knownTags"
            :key="tag"
            :checked="filteredTags.includes(tag)"
            @change="filteredTags = toggleSelectedKeys(filteredTags, tag, $event.target.checked)"
          >
            {{ tag }}
          </a-checkbox>
        </div>
      </template>
      <template slot-scope="tags">
        <span>
          <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag>
        </span>
      </template>
    </a-table-column>
    <a-table-column key="action" title="Action">
      <template slot-scope="text, record">
        <span>
          <a>Action 一 {{ record.firstName }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
        </span>
      </template>
    </a-table-column>
  </a-table>
</template>
<script>
const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default {
  data() {
    return {
      data,
      knownTags: ['nice', 'cool', 'loser'],
      filteredTags: [],
      tagsFilterDropdownVisible: false,
    };
  },
  methods: {
    toggleSelectedKeys(selectedKeys, tag, checked) {
      let newKeys = [...selectedKeys];
      if (checked) {
        newKeys.push(tag);
      } else {
        newKeys = newKeys.filter(sk => sk != tag);
      }
      return newKeys;
    },
  },
};
</script>
```
