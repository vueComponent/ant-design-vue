<cn>
#### 定制回填内容
使用 `optionLabelProp` 指定回填到选择框的 `Option` 属性。
</cn>

<us>
#### Custom selection render
Spacified the prop name of Option which will be rendered in select box.
</us>

```vue
<template>
  <a-select
    v-model="value"
    mode="multiple"
    style="width: 100%"
    placeholder="select one country"
    option-label-prop="label"
  >
    <a-select-option value="china" label="China">
      <span role="img" aria-label="China">
        🇨🇳
      </span>
      China (中国)
    </a-select-option>
    <a-select-option value="usa" label="USA">
      <span role="img" aria-label="USA">
        🇺🇸
      </span>
      USA (美国)
    </a-select-option>
    <a-select-option value="japan" label="Japan">
      <span role="img" aria-label="Japan">
        🇯🇵
      </span>
      Japan (日本)
    </a-select-option>
    <a-select-option value="korea" label="Korea">
      <span role="img" aria-label="Korea">
        🇰🇷
      </span>
      Korea (韩国)
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  data() {
    return {
      value: ['china'],
    };
  },
  watch: {
    value(val) {
      console.log(`selected:`, val);
    },
  },
};
</script>
```
