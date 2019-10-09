<cn>
#### 带搜索框
带搜索框的穿梭框，可以自定义搜索函数。
</cn>

<us>
#### Search
Transfer with a search box.
</us>

```tpl
<template>
  <a-transfer
    :dataSource="mockData"
    showSearch
    :filterOption="filterOption"
    :targetKeys="targetKeys"
    @change="handleChange"
    @search="handleSearch"
    :render="item=>item.title"
  >
  </a-transfer>
</template>
<script>
  export default {
    data() {
      return {
        mockData: [],
        targetKeys: [],
      };
    },
    mounted() {
      this.getMock();
    },
    methods: {
      getMock() {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.mockData = mockData;
        this.targetKeys = targetKeys;
      },
      filterOption(inputValue, option) {
        return option.description.indexOf(inputValue) > -1;
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
      },
      handleSearch(dir, value) {
        console.log('search:', dir, value);
      },
    },
  };
</script>
```
