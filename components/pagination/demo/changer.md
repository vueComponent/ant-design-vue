<cn>
#### 改变
改变每页显示条目数。
</cn>

<us>
#### Changer
Change `pageSize`.
</us>

```tpl
<template>
  <div>
    <a-pagination
      showSizeChanger
      @showSizeChange="onShowSizeChange"
      :defaultCurrent="3"
      :total="500"
    />
    <br />
    <a-pagination
      showSizeChanger
      :pageSize.sync="pageSize"
      @showSizeChange="onShowSizeChange"
      :total="500"
      v-model="current"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageSize: 20,
        current: 4,
      };
    },
    watch: {
      pageSize(val) {
        console.log('pageSize', val);
      },
      current(val) {
        console.log('current', val);
      },
    },
    methods: {
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
      },
    },
  };
</script>
```
