<cn>
#### 基本使用
基本使用。通过 dataSource 设置自动完成的数据源
</cn>

<us>
#### Basic Usage
Basic Usage, set datasource of autocomplete with `dataSource` property.
</us>

```vue
<template>
  <a-auto-complete
    v-model="value"
    :data-source="dataSource"
    style="width: 200px"
    placeholder="input here"
    @select="onSelect"
    @search="onSearch"
    @change="onChange"
  />
</template>
<script>
export default {
  data() {
    return {
      value: '',
      dataSource: [],
    };
  },
  watch: {
    value(val) {
      console.log('value', val);
    },
  },
  methods: {
    onSearch(searchText) {
      this.dataSource = !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)];
    },
    onSelect(value) {
      console.log('onSelect', value);
    },
    onChange(value) {
      console.log('onChange', value);
    },
  },
};
</script>
```
