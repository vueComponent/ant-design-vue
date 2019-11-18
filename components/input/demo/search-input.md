<cn>
#### 搜索框
带有搜索按钮的输入框。
</cn>

<us>
#### Search box
Example of creating a search box by grouping a standard input with a search button.
</us>

```tpl
<template>
  <div>
    <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
    <br /><br />
    <a-input-search placeholder="input search text" @search="onSearch" enterButton />
    <br /><br />
    <a-input-search
      placeholder="input search text"
      @search="onSearch"
      enterButton="Search"
      size="large"
    />
    <br /><br />
    <a-input-search placeholder="input search text" @search="onSearch" size="large">
      <a-button slot="enterButton">Custom</a-button>
    </a-input-search>
  </div>
</template>

<script>
  export default {
    methods: {
      onSearch(value) {
        console.log(value);
      },
    },
  };
</script>
```
