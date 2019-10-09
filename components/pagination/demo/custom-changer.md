<cn>
#### 自定义下拉选项
自定义下拉选项，例如添加全部选项
</cn>

<us>
#### Custom dropdown options
Customize dropdown options such as adding all options
</us>

```tpl
<template>
  <a-pagination
    :pageSizeOptions="pageSizeOptions"
    :total="total"
    showSizeChanger
    :pageSize="pageSize"
    v-model="current"
    @showSizeChange="onShowSizeChange"
  >
    <template slot="buildOptionText" slot-scope="props">
      <span v-if="props.value!=='50'">{{props.value}}条/页</span>
      <span v-if="props.value==='50'">全部</span>
    </template>
  </a-pagination>
</template>
<script>
  export default {
    data() {
      return {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 10,
        total: 50,
      };
    },
    methods: {
      onShowSizeChange(current, pageSize) {
        this.pageSize = pageSize;
      },
    },
  };
</script>
```
