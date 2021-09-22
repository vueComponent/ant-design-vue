<docs>
---
order: 6
title:
  zh-CN: 输入框组合
  en-US: Input Group
---

## zh-CN

输入框的组合展现。
注意：使用 `compact` 模式时，不需要通过 `Col` 来控制宽度。

## en-US

Input.Group example
Note: You don't need `Col` to control the width in the `compact` mode.

</docs>
<template>
  <div>
    <a-input-group size="large">
      <a-row :gutter="8">
        <a-col :span="5">
          <a-input v-model:value="value1" />
        </a-col>
        <a-col :span="8">
          <a-input v-model:value="value2" />
        </a-col>
      </a-row>
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-input v-model:value="value1" style="width: 20%" />
      <a-input v-model:value="value2" style="width: 30%" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value3">
        <a-select-option value="Zhejiang">Zhejiang</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input v-model:value="value4" style="width: 50%" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value5">
        <a-select-option value="Option1">Option1</a-select-option>
        <a-select-option value="Option2">Option2</a-select-option>
      </a-select>
      <a-input v-model:value="value6" style="width: 50%" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-input v-model:value="value7" style="width: 50%" />
      <a-date-picker v-model:value="value8" style="width: 50%" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value9">
        <a-select-option value="Option1-1">Option1-1</a-select-option>
        <a-select-option value="Option1-2">Option1-2</a-select-option>
      </a-select>
      <a-select v-model:value="value10">
        <a-select-option value="Option2-1">Option2-1</a-select-option>
        <a-select-option value="Option2-2">Option2-2</a-select-option>
      </a-select>
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value11">
        <a-select-option value="1">Between</a-select-option>
        <a-select-option value="2">Except</a-select-option>
      </a-select>
      <a-input
        v-model:value="value12"
        style="width: 100px; text-align: center"
        placeholder="Minimum"
      />
      <a-input
        v-model:value="value13"
        style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
        placeholder="~"
        disabled
      />
      <a-input
        v-model:value="value14"
        style="width: 100px; text-align: center; border-left: 0"
        placeholder="Maximum"
      />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value15">
        <a-select-option value="Sign Up">Sign Up</a-select-option>
        <a-select-option value="Sign In">Sign In</a-select-option>
      </a-select>
      <a-auto-complete
        v-model:value="value16"
        :options="[{ value: 'text 1' }, { value: 'text 2' }]"
        style="width: 200px"
        placeholder="Email"
      />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select v-model:value="value17" style="width: 30%">
        <a-select-option value="Home">Home</a-select-option>
        <a-select-option value="Company">Company</a-select-option>
      </a-select>
      <a-cascader
        v-model:value="value18"
        style="width: 70%"
        :options="options"
        placeholder="Select Address"
      />
    </a-input-group>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

const options = [
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
];
export default defineComponent({
  setup() {
    const value1 = ref<string>('0571');
    const value2 = ref<string>('26888888');
    const value3 = ref<string>('Zhejiang');
    const value4 = ref<string>('Xihu District, Hangzhou');
    const value5 = ref<string>('Option1');
    const value6 = ref<string>('input content');
    const value7 = ref<string>('input content');
    const value8 = ref<string | null>(null);
    const value9 = ref<string>('Option1-1');
    const value10 = ref<string>('Option2-2');
    const value11 = ref<string>('1');
    const value12 = ref<string>('');
    const value13 = ref<string>('');
    const value14 = ref<string>('');
    const value15 = ref<string>('Sign Up');
    const value16 = ref<string>('');
    const value17 = ref<string>('Home');
    const value18 = ref<string[]>([]);

    return {
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      value7,
      value8,
      value9,
      value10,
      value11,
      value12,
      value13,
      value14,
      value15,
      value16,
      value17,
      value18,
      options,
    };
  },
});
</script>
