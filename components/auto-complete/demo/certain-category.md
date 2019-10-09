<cn>
#### 查询模式 - 确定类目
查询模式 - 确定类目
</cn>

<us>
#### Lookup-Patterns - Certain Category
Lookup-Patterns - Certain Category
</us>

```tpl
<template>
  <div class="certain-category-search-wrapper" style="width: 250px">
    <a-auto-complete
      class="certain-category-search"
      dropdownClassName="certain-category-search-dropdown"
      :dropdownMatchSelectWidth="false"
      :dropdownStyle="{width: '300px'}"
      size="large"
      style="width: 100%"
      placeholder="input here"
      optionLabelProp="value"
    >
      <template slot="dataSource">
        <a-select-opt-group v-for="group in dataSource" :key="group.title">
          <span slot="label">
            {{group.title}}
            <a
              style="float: right"
              href="https://www.google.com/search?q=antd"
              target="_blank"
              rel="noopener noreferrer"
              >更多
            </a>
          </span>
          <a-select-option v-for="opt in group.children" :key="opt.title" :value="opt.title">
            {{opt.title}}
            <span class="certain-search-item-count">{{opt.count}} 人 关注</span>
          </a-select-option>
        </a-select-opt-group>
        <a-select-option disabled key="all" class="show-all">
          <a href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
            查看所有结果
          </a>
        </a-select-option>
      </template>
      <a-input>
        <a-icon slot="suffix" type="search" class="certain-category-icon" />
      </a-input>
    </a-auto-complete>
  </div>
</template>
<script>
  const dataSource = [
    {
      title: '话题',
      children: [
        {
          title: 'AntDesign',
          count: 10000,
        },
        {
          title: 'AntDesign UI',
          count: 10600,
        },
      ],
    },
    {
      title: '问题',
      children: [
        {
          title: 'AntDesign UI 有多好',
          count: 60100,
        },
        {
          title: 'AntDesign 是啥',
          count: 30010,
        },
      ],
    },
    {
      title: '文章',
      children: [
        {
          title: 'AntDesign 是一个设计语言',
          count: 100000,
        },
      ],
    },
  ];
  export default {
    data() {
      return {
        dataSource,
      };
    },
  };
</script>
<style>
  .certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
    color: #666;
    font-weight: bold;
  }

  .certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
    border-bottom: 1px solid #f6f6f6;
  }

  .certain-category-search-dropdown .ant-select-dropdown-menu-item {
    padding-left: 16px;
  }

  .certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
    text-align: center;
    cursor: default;
  }

  .certain-category-search-dropdown .ant-select-dropdown-menu {
    max-height: 300px;
  }
</style>
<style scoped>
  .certain-category-search-wrapper
    >>> .certain-category-search.ant-select-auto-complete
    .ant-input-affix-wrapper
    .ant-input-suffix {
    right: 12px;
  }
  .certain-category-search-wrapper >>> .certain-search-item-count {
    position: absolute;
    color: #999;
    right: 16px;
  }
  .certain-category-search-wrapper
    >>> .certain-category-search.ant-select-focused
    .certain-category-icon {
    color: #108ee9;
  }
  .certain-category-search-wrapper >>> .certain-category-icon {
    color: #6e6e6e;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-size: 16px;
  }
</style>
```
