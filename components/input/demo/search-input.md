<cn>
#### 搜索框
带有搜索按钮的输入框。
</cn>

<us>
#### Search box
Example of creating a search box by grouping a standard input with a search button.
</us>

```html
<template>
  <a-input-search
    placeholder="input search text"
    style="width: 200px"
    @search="onSearch"
  />
</template>

<script>
export default {
  methods: {
    onSearch (value) {
      console.log(value)
    },
  },
}
</script>
```


