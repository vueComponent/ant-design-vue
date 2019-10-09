<cn>
#### 自定义已选项
例如给最后一项加上邮编链接。
</cn>

<us>
#### Custom render
For instance, add an external link after the selected value.
</us>

```tpl
<template>
  <a-cascader
    :options="options"
    :defaultValue="['zhejiang', 'hangzhou', 'xihu']"
    style="width: 100%"
  >
    <template slot="displayRender" slot-scope="{labels, selectedOptions}">
      <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
        <span v-if="index === labels.length - 1">
          {{label}} (<a @click="e => handleAreaClick(e, label, selectedOptions[index])"
            >{{selectedOptions[index].code}}</a
          >)
        </span>
        <span v-else @click="onChange">
          {{label}} /
        </span>
      </span>
    </template>
  </a-cascader>
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
                    code: 752100,
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
                    code: 453400,
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
      handleAreaClick(e, label, option) {
        e.stopPropagation();
        console.log('clicked', label, option);
      },
    },
  };
</script>
```
