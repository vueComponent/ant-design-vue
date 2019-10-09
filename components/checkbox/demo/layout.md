<cn>
#### 布局
Checkbox.Group内嵌Checkbox并与Grid组件一起使用，可以实现灵活的布局
</cn>

<us>
#### Use with grid
We can use Checkbox and Grid Checkbox.group, to implement complex layout
</us>

```tpl
<template>
  <a-checkbox-group @change="onChange">
    <a-row>
      <a-col :span="8"><a-checkbox value="A">A</a-checkbox></a-col>
      <a-col :span="8"><a-checkbox value="B">B</a-checkbox></a-col>
      <a-col :span="8"><a-checkbox value="C">C</a-checkbox></a-col>
      <a-col :span="8"><a-checkbox value="D">D</a-checkbox></a-col>
      <a-col :span="8"><a-checkbox value="E">E</a-checkbox></a-col>
    </a-row>
  </a-checkbox-group>
</template>
<script>
  export default {
    methods: {
      onChange(checkedValues) {
        console.log('checked = ', checkedValues);
      },
    },
  };
</script>
```
