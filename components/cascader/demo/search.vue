<docs>
---
order: 8
title:
  zh-CN: 搜索
  en-US: Search
---

## zh-CN

可以直接搜索选项并选择。
> `Cascader[showSearch]` 暂不支持服务端搜索，更多信息见 [#5547](https://github.com/ant-design/ant-design/issues/5547)

## en-US

Search and select options directly.
> Now, `Cascader[showSearch]` doesn't support search on server, more info [#5547](https://github.com/ant-design/ant-design/issues/5547)

</docs>
<template>
  <a-cascader
    v-model:value="value"
    :options="options"
    :show-search="{ filter }"
    placeholder="Please select"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  children?: Option[];
}
const options: Option[] = [
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
          {
            value: 'xiasha',
            label: 'Xia Sha',
            disabled: true,
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
            label: 'Zhong Hua men',
          },
        ],
      },
    ],
  },
];
export default defineComponent({
  setup() {
    const filter = (inputValue: string, path: Option[]) => {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    };

    return {
      value: ref<string[]>([]),
      options,
      filter,
    };
  },
});
</script>
