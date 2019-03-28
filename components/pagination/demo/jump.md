<cn>
#### 跳转
快速跳转到某一页。
</cn>

<us>
#### Jumper
Jump to a page directly.
</us>

```html
<template>
  <div id="components-pagination-demo-mini">
    <a-pagination showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" />
    <a-pagination :locale="locale" :showQuickJumper="goButton" :defaultCurrent="2" :total="500" @change="onChange" />
  </div>
</template>
<script>
  export default {
    data() {
      const goButton = { goButton: <a-button>跳转</a-button> };
      const locale = { jump_to: '向第' };
      return {
        locale,
        goButton,
      }
    },
    methods: {
      onChange(pageNumber) {
        console.log('Page: ', pageNumber);
      }
    }
  }
</script>
<style scoped>
#components-pagination-demo-mini .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>
```


