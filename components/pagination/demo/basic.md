<cn>
#### 基本
基础分页。
</cn>

<us>
#### Basic
Basic pagination.
</us>

```tpl
<template>
  <a-pagination v-model="current" :total="50" />
</template>
<script>
  export default {
    data() {
      return {
        current: 2,
      };
    },
  };
</script>
```
