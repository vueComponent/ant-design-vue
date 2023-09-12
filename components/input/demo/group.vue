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

a-input-group example
Note: You don't need `Col` to control the width in the `compact` mode.

</docs>
<template>
  <a-space class="site-input-group-wrapper" direction="vertical" size="middle">
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
    <a-input-group compact>
      <a-input v-model:value="value1" style="width: 20%" />
      <a-input v-model:value="value2" style="width: 30%" />
    </a-input-group>
    <a-input-group compact>
      <a-select v-model:value="value3">
        <a-select-option value="Zhejiang">Zhejiang</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input v-model:value="value4" style="width: 50%" />
    </a-input-group>
    <a-input-group compact>
      <a-select v-model:value="value5">
        <a-select-option value="Option1">Option1</a-select-option>
        <a-select-option value="Option2">Option2</a-select-option>
      </a-select>
      <a-input v-model:value="value6" style="width: 50%" />
    </a-input-group>
    <a-input-group compact>
      <a-input v-model:value="value7" style="width: 50%" />
      <a-date-picker v-model:value="value8" style="width: 50%" />
    </a-input-group>
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
        class="site-input-split"
        style="width: 30px; border-left: 0; pointer-events: none"
        placeholder="~"
        disabled
      />
      <a-input
        v-model:value="value14"
        class="site-input-right"
        style="width: 100px; text-align: center"
        placeholder="Maximum"
      />
    </a-input-group>
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
    <a-input-group compact>
      <a-input v-model:value="value19" style="width: calc(100% - 200px)" />
      <a-button type="primary">Submit</a-button>
    </a-input-group>
    <a-input-group compact>
      <a-input v-model:value="value20" style="width: calc(100% - 200px)" />
      <a-tooltip title="copy git url">
        <a-button>
          <template #icon><CopyOutlined /></template>
        </a-button>
      </a-tooltip>
    </a-input-group>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { CopyOutlined } from '@ant-design/icons-vue';

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
const value19 = ref<string>('https://surely.cool');
const value20 = ref<string>('https://antdv.com');
</script>
<style scoped>
.site-input-group-wrapper .site-input-split {
  background-color: #fff;
}

.site-input-group-wrapper .site-input-right {
  border-left-width: 0;
}

.site-input-group-wrapper .site-input-right:hover,
.site-input-group-wrapper .site-input-right:focus {
  border-left-width: 1px;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right {
  border-right-width: 0;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right:hover,
.site-input-group-wrapper .ant-input-rtl.site-input-right:focus {
  border-right-width: 1px;
}
[data-theme='dark'] .site-input-group-wrapper .site-input-split {
  background-color: transparent;
}
</style>
