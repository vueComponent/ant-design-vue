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
<div>
  <a-pagination showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" />
  <br/>
  <a-pagination showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" disabled showLessItems />
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
