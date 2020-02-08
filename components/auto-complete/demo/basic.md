<cn>
#### 基本使用
基本使用。通过 dataSource 设置自动完成的数据源
</cn>

<us>
#### Basic Usage
Basic Usage, set datasource of autocomplete with `dataSource` property.
</us>

```tpl
<template>
<div>
  <a-auto-complete
    :dataSource="dataSource"
    style="width: 200px"
    @select="onSelect"
    @search="onSearch"
    placeholder="input here"
  />
  <br />
  <br />
  <a-auto-complete
    :value="value"
    :dataSource="dataSource"
    style="width: 200px"
    @select="onSelect"
    @search="onSearch"
    @change="onChange"
    placeholder="control mode"
  />
</div>
</template>
<script>
  export default {
    data() {
      return {
        value: '',
        dataSource: [],
      };
    },
    methods: {
      onSearch(searchText) {
        this.dataSource = !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)];
      },
      onSelect(value) {
        console.log('onSelect', value);
      },
      onChange(value) {
        this.value = value;
      }
    },
  };
</script>
```
