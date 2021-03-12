<cn>
#### 跳转
快速跳转到某一页。
</cn>

<us>
#### Jumper
Jump to a page directly.
</us>

```vue
<template>
  <div>
    <a-pagination show-quick-jumper :default-current="2" :total="500" @change="onChange" />
    <br />
    <a-pagination
      show-quick-jumper
      :default-current="2"
      :total="500"
      disabled
      show-less-items
      @change="onChange"
    />
  </div>
</template>
<script>
export default {
  methods: {
    onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    },
  },
};
</script>
```
