<cn>
#### 虚拟滚动
`virtual` 开启虚拟滚动
</cn>

<us>
#### Virtual scroll
`virtual` enabling virtual scroll
</us>

```vue
<template>
  <a-select :virtual="true" style="width: 100%" placeholder="Tags Mode">
    <a-select-option v-for="i in 11125" :key="i">{{ (i + 9).toString(36) + i }}</a-select-option>
  </a-select>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
```
