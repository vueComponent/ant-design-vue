<cn>
#### 获得选项的文本
默认情况下 `onChange` 里只能拿到 value，如果需要拿到选中的节点文本 label，可以使用 `labelInValue` 属性。
选中项的 label 会被包装到 value 中传递给 `onChange` 等函数，此时 value 是一个对象。
</cn>

<us>
#### Get value of selected item
As a default behavior, the onChange callback can only get the value of the selected item. The labelInValue prop can be used to get the label property of the selected item.
The label of the selected item will be packed as an object for passing to the onChange callback.
</us>

```tpl
<template>
  <a-select
    labelInValue
    :defaultValue="{ key: 'lucy' }"
    style="width: 120px"
    @change="handleChange"
  >
    <a-select-option value="jack">Jack (100)</a-select-option>
    <a-select-option value="lucy">Lucy (101)</a-select-option>
  </a-select>
</template>
<script>
  export default {
    methods: {
      handleChange(value) {
        console.log(value); // { key: "lucy", label: "Lucy (101)" }
      },
    },
  };
</script>
```
