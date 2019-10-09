<cn>
#### 多选
多选，从已有条目中选择（scroll the menu）
</cn>

<us>
#### multiple selection
Multiple selection, selecting from existing items (scroll the menu).
</us>

```tpl
<template>
  <a-select
    mode="multiple"
    :defaultValue="['a1', 'b2']"
    style="width: 100%"
    @change="handleChange"
    placeholder="Please select"
  >
    <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i"
      >{{(i + 9).toString(36) + i}}</a-select-option
    >
  </a-select>
</template>
<script>
  export default {
    methods: {
      handleChange(value) {
        console.log(`selected ${value}`);
      },
    },
  };
</script>
```
