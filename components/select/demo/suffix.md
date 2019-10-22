<cn>
#### 后缀图标
基本使用。
</cn>

<us>
#### Suffix
Basic Usage
</us>

```tpl
<template>
  <div>
    <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
      <a-icon slot="suffixIcon" type="smile" />
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
      <a-select-option value="disabled" disabled>Disabled</a-select-option>
      <a-select-option value="Yiminghe">yiminghe</a-select-option>
    </a-select>
    <a-select defaultValue="lucy" style="width: 120px" disabled>
      <a-icon slot="suffixIcon" type="meh" />
      <a-select-option value="lucy">Lucy</a-select-option>
    </a-select>
  </div>
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
