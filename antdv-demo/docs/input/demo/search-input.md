<cn>
#### 搜索框
带有搜索按钮的输入框。
</cn>

<us>
#### Search box
Example of creating a search box by grouping a standard input with a search button.
</us>

```vue
<template>
  <div>
    <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
    <br /><br />
    <a-input-search placeholder="input search text" enter-button @search="onSearch" />
    <br /><br />
    <a-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <br /><br />
    <a-input-search placeholder="input search text" size="large" @search="onSearch">
      <a-button slot="enterButton">
        Custom
      </a-button>
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
