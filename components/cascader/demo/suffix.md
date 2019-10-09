<cn>
#### 后缀图标
省市区级联。
</cn>

<us>
#### Suffix
Cascade selection box for selecting province/city/district.
</us>

```tpl
<template>
  <div>
    <a-cascader
      style="margin-top: 1rem"
      :options="options"
      @change="onChange"
      placeholder="Please select"
    >
      <a-icon type="smile" slot="suffixIcon" class="test" />
    </a-cascader>
    <a-cascader
      suffixIcon="ab"
      style="margin-top: 1rem"
      :options="options"
      @change="onChange"
      placeholder="Please select"
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
