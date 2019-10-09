<cn>
#### 自定义筛选菜单
通过 `filterDropdown` 定义自定义的列筛选功能，并实现一个搜索列的示例。
</cn>

<us>
#### Customized filter panel
Implement a customized column search example via `filterDropdown`.
</us>

```tpl
<template>
  <a-table :dataSource="data" :columns="columns">
    <div
      slot="filterDropdown"
      slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      style="padding: 8px"
    >
      <a-input
        v-ant-ref="c => searchInput = c"
        :placeholder="`Search ${column.dataIndex}`"
        :value="selectedKeys[0]"
        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="() => handleSearch(selectedKeys, confirm)"
        style="width: 188px; margin-bottom: 8px; display: block;"
      />
      <a-button
        type="primary"
        @click="() => handleSearch(selectedKeys, confirm)"
        icon="search"
        size="small"
        style="width: 90px; margin-right: 8px"
        >Search</a-button
      >
      <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px"
        >Reset</a-button
      >
    </div>
    <a-icon
      slot="filterIcon"
      slot-scope="filtered"
      type="search"
      :style="{ color: filtered ? '#108ee9' : undefined }"
    />
    <template slot="customRender" slot-scope="text">
      <span v-if="searchText">
        <template
          v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
            >{{fragment}}</mark
          >
          <template v-else
            >{{fragment}}</template
          >
        </template>
      </span>
      <template v-else
        >{{text}}</template
      >
    </template>
  </a-table>
</template>

<script>
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Joe Black',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Jim Green',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];

  export default {
    data() {
      return {
        data,
        searchText: '',
        searchInput: null,
        columns: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            },
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) => record.age.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                });
              }
            },
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) => record.address.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                });
              }
            },
          },
        ],
      };
    },
    methods: {
      handleSearch(selectedKeys, confirm) {
        confirm();
        this.searchText = selectedKeys[0];
      },

      handleReset(clearFilters) {
        clearFilters();
        this.searchText = '';
      },
    },
  };
</script>
<style scoped>
  .highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
  }
</style>
```
