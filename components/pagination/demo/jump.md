<cn>
#### 跳转
快速跳转到某一页。
</cn>

<us>
#### Jumper
Jump to a page directly.
</us>

```tpl
<template>
  <a-pagination showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" />
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
