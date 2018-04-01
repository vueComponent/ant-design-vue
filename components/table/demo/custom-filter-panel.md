<cn>
#### 自定义筛选菜单
通过 `filterDropdown`、`filterDropdownVisible` 和 `filterDropdownVisibleChange` 定义自定义的列筛选功能，并实现一个搜索列的示例。
</cn>

<us>
#### Customized filter panel
Implement a customized column search example via `filterDropdown`, `filterDropdownVisible` and `filterDropdownVisibleChange`.
</us>

```html
<template>
  <a-table :dataSource="data">
    <a-table-column
      title="Name"
      dataIndex="name"
      key="name"
      :filterDropdownVisible="filterDropdownVisible"
      @filterDropdownVisibleChange="onFilterDropdownVisibleChange"
    >
      <div slot="filterDropdown" class="custom-filter-dropdown">
        <a-input
          ref="searchInput"
          placeholder="Search name"
          :value="searchText"
          @change="onInputChange"
          @pressEnter="onSearch"
        />
        <a-button type="primary" @click="onSearch">Search</a-button>
      </div>
      <a-icon slot="filterIcon" type="smile-o" :style="{ color: this.filtered ? '#108ee9' : '#aaa' }" />
    </a-table-column>
    <a-table-column
      title="Age"
      dataIndex="age"
      key="age"
    />
    <a-table-column
      title="Address"
      dataIndex="address"
      key="address"
      :filters="filters"
      @filter="(value, record) => record.address.indexOf(value) === 0"
    />
  </a-table>
</template>

<script>
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Joe Black',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Jim Green',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Jim Red',
  age: 32,
  address: 'London No. 2 Lake Park',
}];

export default {
  data() {
    return {
      filterDropdownVisible: false,
      data,
      searchText: '',
      filtered: false,
      filters: [{
        text: 'London',
        value: 'London',
      }, {
        text: 'New York',
        value: 'New York',
      }],
    }
  },
  methods: {
    onFilterDropdownVisibleChange(visible) {
      this.filterDropdownVisible = visible;
      this.$nextTick(() => {
        this.$refs.searchInput && this.$refs.searchInput.focus()
      })
    },
    onInputChange(e) {
      this.searchText = e.target.value;
    },
    onSearch () {
      const { searchText } = this;
      const reg = new RegExp(searchText, 'gi');
      Object.assign(this, {
        filterDropdownVisible: false,
        filtered: !!searchText,
        data: data.map((record) => {
          const match = record.name.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
                {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span class="highlight">{match[0]}</span>, text] : text
                ))}
              </span>
            ),
          };
        }).filter(record => !!record),
      })
    },
  },
}
</script>
<style scoped>
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
}

.custom-filter-dropdown input {
  width: 130px;
  margin-right: 8px;
}

.highlight {
  color: #f50;
}
</style>
```
