<cn>
#### 从数据直接生成
使用 `options` 把 JSON 数据直接生成选择列表。
</cn>

<us>
#### Generate form options
The select list can be populated using `options` property. This is a quick and easy way to provide the select content.
</us>

```vue
<template>
  <a-select
    default-value="beijing"
    style="width: 120px"
    :options="options"
    @change="handleChange"
  />
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          label: '北京',
          value: 'beijing',
          title: '北京 010',
          key: '010',
        },
        {
          label: '上海',
          value: 'shanghai',
          key: '021',
        },
        {
          label: '杭州',
          value: 'hangzhou',
          key: '0571',
          disabled: true,
        },
      ],
    };
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
  },
};
</script>
```
