<docs>
---
order: 1
title:
  zh-CN: 单向样式
  en-US: One Way
---

## zh-CN

通过 `oneWay` 将 Transfer 转为单向样式。

## en-US

Use `oneWay` to makes Transfer to one way style.

</docs>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="mockData"
      :one-way="true"
      :titles="['Source', 'Target']"
      :render="item => item.title"
      :disabled="disabled"
      @change="handleChange"
      @selectChange="handleSelectChange"
      @scroll="handleScroll"
    />
    <a-switch
      v-model:checked="disabled"
      un-checked-children="enabled"
      checked-children="disabled"
      style="margin-top: 16px"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
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

const disabled = ref<boolean>(false);

const targetKeys = ref<string[]>([]);

const selectedKeys = ref<string[]>(['1', '4']);

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  console.log('targetKeys: ', nextTargetKeys);
  console.log('direction: ', direction);
  console.log('moveKeys: ', moveKeys);
};
const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  console.log('sourceSelectedKeys: ', sourceSelectedKeys);
  console.log('targetSelectedKeys: ', targetSelectedKeys);
};
const handleScroll = (direction: string, e: Event) => {
  console.log('direction:', direction);
  console.log('target:', e.target);
};
</script>
