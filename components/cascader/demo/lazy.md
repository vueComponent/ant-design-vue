<cn>
#### 动态加载选项
使用 `loadData` 实现动态加载选项。
> 注意：`loadData` 与 `showSearch` 无法一起使用。
</cn>

<us>
#### Load Options Lazily
Load options lazily with `loadData`.
> Note: `loadData` cannot work with `showSearch`.
</us>

```tpl
<template>
  <a-cascader
    :options="options"
    @change="onChange"
    :loadData="loadData"
    placeholder="Please select"
    changeOnSelect
  />
</template>
<script>
  export default {
    data() {
      return {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            isLeaf: false,
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            isLeaf: false,
          },
        ],
      };
    },
    methods: {
      onChange(value) {
        console.log(value);
      },
      loadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
          targetOption.loading = false;
          targetOption.children = [
            {
              label: `${targetOption.label} Dynamic 1`,
              value: 'dynamic1',
            },
            {
              label: `${targetOption.label} Dynamic 2`,
              value: 'dynamic2',
            },
          ];
          this.options = [...this.options];
        }, 1000);
      },
    },
  };
</script>
```
