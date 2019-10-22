<cn>
#### 分组
用 `OptGroup` 进行选项分组。
</cn>

<us>
#### Option Group
Using `OptGroup` to group the options.
</us>

```tpl
<template>
  <a-select defaultValue="lucy" style="width: 200px" @change="handleChange">
    <a-select-opt-group>
      <span slot="label"><a-icon type="user" />Manager</span>
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select-opt-group>
    <a-select-opt-group label="Engineer">
      <a-select-option value="Yiminghe">yiminghe</a-select-option>
    </a-select-opt-group>
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
