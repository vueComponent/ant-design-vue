<cn>
#### 自定义字段名
自定义字段名。
</cn>

<us>
#### Custom Field Names
Custom Field Names.
</us>

```tpl
<template>
  <a-cascader
    :fieldNames="{ label: 'name', value: 'code', children: 'items' }"
    :options="options"
    @change="onChange"
    placeholder="Please select"
  />
</template>
<script>
  const options = [
    {
      code: 'zhejiang',
      name: 'Zhejiang',
      items: [
        {
          code: 'hangzhou',
          name: 'Hangzhou',
          items: [
            {
              code: 'xihu',
              name: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      code: 'jiangsu',
      name: 'Jiangsu',
      items: [
        {
          code: 'nanjing',
          name: 'Nanjing',
          items: [
            {
              code: 'zhonghuamen',
              name: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];
  export default {
    data() {
      return {
        options,
      };
    },
    methods: {
      onChange(value) {
        console.log(value);
      },
    },
  };
</script>
```
