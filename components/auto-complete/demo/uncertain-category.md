<cn>
#### 查询模式 - 不确定类目
查询模式 - 不确定类目
</cn>

<us>
#### Lookup-Patterns - Uncertain Category
Lookup-Patterns - Uncertain Category
</us>

```tpl
<template>
  <div class="global-search-wrapper" style="width: 300px">
    <a-auto-complete
      class="global-search"
      size="large"
      style="width: 100%"
      @select="onSelect"
      @search="handleSearch"
      placeholder="input here"
      optionLabelProp="text"
    >
      <template slot="dataSource">
        <a-select-option v-for="item in dataSource" :key="item.category" :text="item.category">
          {{item.query}} 在
          <a
            :href="`https://s.taobao.com/search?q=${item.query}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{item.category}}
          </a>
          区块中
          <span className="global-search-item-count">约 {{item.count}} 个结果</span>
        </a-select-option>
      </template>
      <a-input>
        <a-button slot="suffix" class="search-btn" size="large" type="primary">
          <a-icon type="search" />
        </a-button>
      </a-input>
    </a-auto-complete>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dataSource: [],
      };
    },
    methods: {
      onSelect(value) {
        console.log('onSelect', value);
      },

      handleSearch(value) {
        this.dataSource = value ? this.searchResult(value) : [];
      },

      getRandomInt(max, min = 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      searchResult(query) {
        return new Array(this.getRandomInt(5))
          .join('.')
          .split('.')
          .map((item, idx) => ({
            query,
            category: `${query}${idx}`,
            count: this.getRandomInt(200, 100),
          }));
      },
    },
  };
</script>

<style>
  .global-search-wrapper {
    padding-right: 50px;
  }

  .global-search {
    width: 100%;
  }

  .global-search.ant-select-auto-complete .ant-select-selection--single {
    margin-right: -46px;
  }

  .global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding-right: 62px;
  }

  .global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix {
    right: 0;
  }

  .global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .global-search-item-count {
    position: absolute;
    right: 16px;
  }
</style>
```
