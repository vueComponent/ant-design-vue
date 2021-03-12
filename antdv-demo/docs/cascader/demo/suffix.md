<cn>
#### 后缀图标
省市区级联。
</cn>

<us>
#### Suffix
Cascade selection box for selecting province/city/district.
</us>

```vue
<template>
  <div>
    <a-cascader
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
      @change="onChange"
    >
      <a-icon slot="suffixIcon" type="smile" class="test" />
    </a-cascader>
    <a-cascader
      suffix-icon="ab"
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
      @change="onChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
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
