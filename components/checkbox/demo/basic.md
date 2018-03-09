<cn>
#### 基本用法
简单的checkbox
</cn>

<us>
#### Basic
Basic usage of checkbox
</us>

```html
<template>
  <a-checkbox @change="onChange">Checkbox</a-checkbox>
</template>
<script>
export default {
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.checked}`)
    },
  },
}
</script>
```
