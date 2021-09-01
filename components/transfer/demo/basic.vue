<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic usage
---

## zh-CN

最基本的用法，展示了 `dataSource`、`targetKeys`、每行的渲染函数 `render` 以及回调函数 `change` `selectChange` `scroll` 的用法。

## en-US

The most basic usage of `Transfer` involves providing the source data and target keys arrays, plus the rendering and some callback functions.

</docs>

<template>
  <div>
    <a-transfer
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :target-keys="targetKeys"
      :selected-keys="selectedKeys"
      :render="item => item.title"
      :disabled="disabled"
      @change="handleChange"
      @selectChange="handleSelectChange"
      @scroll="handleScroll"
    />
    <a-switch
      un-checked-children="enabled"
      checked-children="disabled"
      v-model:checked="disabled"
      style="margin-top: 16px"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
interface MockData {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}
const mockData: MockData[] = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);
export default defineComponent({
  data() {
    const disabled = ref<boolean>(false);

    const targetKeys = ref<string[]>(oriTargetKeys);

    const selectedKeys = ref<string[]>(['1', '4']);

    const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
      targetKeys.value = nextTargetKeys;
      console.log('targetKeys: ', nextTargetKeys);
      console.log('direction: ', direction);
      console.log('moveKeys: ', moveKeys);
    };
    const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
      selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
      console.log('sourceSelectedKeys: ', sourceSelectedKeys);
      console.log('targetSelectedKeys: ', targetSelectedKeys);
    };
    const handleScroll = (direction: string, e: Event) => {
      console.log('direction:', direction);
      console.log('target:', e.target);
    };

    return {
      mockData,
      targetKeys,
      selectedKeys,
      disabled,
      handleChange,
      handleSelectChange,
      handleScroll,
    };
  },
});
</script>
