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
  <a-auto-complete
    :dataSource="dataSource"
    style="width: 200px"
    @select="onSelect"
    @search="handleSearch"
    placeholder="input here"
  />
</template>
<script>
  export default {
    data() {
      return {
        dataSource: [],
      };
    },
    methods: {
      handleSearch(value) {
        this.dataSource = !value ? [] : [value, value + value, value + value + value];
      },
      onSelect(value) {
        console.log('onSelect', value);
      },
    },
  };
</script>
```
