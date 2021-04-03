<cn>
#### template 风格的 API
使用 template 风格的 API
“Last Name” 列展示了列筛选在 template 风格 API 中的通常用法。
“Tags” 列展示了自定义列筛选以及“双向绑定”的 filterDropdownVisible 属性，其内部使用了事件 update:filterDropdownVisible。
> 这个只是一个描述 `columns` 的语法糖，所以你不能用其他组件去包裹 `Column` 和 `ColumnGroup`。
</cn>

<us>
#### template style API
Using template style API
The "Last Name" column shows the normal usage of column filter using template style API.
The "Tags" column shows a customized column search, and also the "two-way binding" of prop filterDropdownVisible, which use event update:filterDropdownVisible.
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
        :default-filtered-value="['Brown', 'Green']"
        @filter="(value, record) => record.lastName == value"
      />
    </a-table-column-group>
    <a-table-column key="age" title="Age" data-index="age" />
    <a-table-column key="address" title="Address" data-index="address" />
    <a-table-column
      key="tags"
      :title="`Tags ${tagsFilterDropdownVisible ? 'filtering' : ''}`"
      data-index="tags"
      :filtered-value="filteredTags"
      @filter="(value, record) => record.tags.includes(value)"
      :filter-dropdown-visible.sync="tagsFilterDropdownVisible"
    >
      <template slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys }">
        <div style="background-color: white; border: solid;">
          <a-checkbox
            v-for="tag in ['nice', 'cool', 'loser']"
            :key="tag"
            :checked="filteredTags.includes(tag)"
            @change="filteredTags = toggleSelectedTags(filteredTags, tag, $event.target.checked)"
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
      filteredTags: [],
      tagsFilterDropdownVisible: false,
    };
  },
  methods: {
    toggleSelectedTags(oldTags, tag, checked) {
      let newTags = [...oldTags];
      if (checked) {
        newTags.push(tag);
      } else {
        newTags = newTags.filter(t => t != tag);
      }
      return newTags;
    },
  },
};
</script>
```
