<docs>
---
order: 6
title:
  zh-CN: 紧凑布局组合
  en-US: Compact Mode for form component
---

## zh-CN

使用 Space.Compact 让表单组件之间紧凑连接且合并边框。

## en-US

Compact Mode for form component.

</docs>

<template>
  <div className="site-space-compact-wrapper">
    <a-space-compact block>
      <a-input :style="{ width: '20%' }" default-value="0571" />
      <a-input :style="{ width: '30%' }" default-value="26888888" />
    </a-space-compact>
    <br />
    <a-space-compact block size="small">
      <a-input :style="{ width: 'calc(100% - 200px)' }" default-value="https://ant.design" />
      <a-button type="primary">Submit</a-button>
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-input :style="{ width: 'calc(100% - 200px)' }" default-value="https://ant.design" />
      <a-button type="primary">Submit</a-button>
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-input
        :style="{ width: 'calc(100% - 200px)' }"
        default-value="git@github.com:ant-design/ant-design.git"
      />
      <a-tooltip title="copy git url">
        <a-button>
          <CopyOutlined />
        </a-button>
      </a-tooltip>
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select default-value="Zhejiang" allow-clear>
        <a-select-option value="Zhejiang">Zhejiang</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input :style="{ width: '50%' }" default-value="Xihu District, Hangzhou" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select allow-clear mode="multiple" default-value="Zhejianggggg" :style="{ width: '50%' }">
        <a-select-option value="Zhejianggggg">Zhejianggggg</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input :style="{ width: '50%' }" default-value="Xihu District, Hangzhou" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-input-search :style="{ width: '30%' }" default-value="0571" />
      <a-input-search allow-clear :style="{ width: '50%' }" default-value="26888888" />
      <a-input-search :style="{ width: '20%' }" default-value="+1" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select default-value="Option1">
        <a-select-option value="Option1">Option1</a-select-option>
        <a-select-option value="Option2">Option2</a-select-option>
      </a-select>
      <a-input :style="{ width: '50%' }" default-value="input content" />
      <a-input-number :default-value="12" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-input :style="{ width: '50%' }" default-value="input content" />
      <a-date-picker :style="{ width: '50%' }" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-range-picker :style="{ width: '70%' }" />
      <a-input :style="{ width: '30%' }" default-value="input content" />
      <a-button type="primary">查询</a-button>
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-input :style="{ width: '30%' }" default-value="input content" />
      <a-range-picker :style="{ width: '70%' }" />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select default-value="Option1-1">
        <a-select-option value="Option1-1">Option1-1</a-select-option>
        <a-select-option value="Option1-2">Option1-2</a-select-option>
      </a-select>
      <a-select default-value="Option2-2">
        <a-select-option value="Option2-1">Option2-1</a-select-option>
        <a-select-option value="Option2-2">Option2-2</a-select-option>
      </a-select>
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select default-value="1">
        <a-select-option value="1">Between</a-select-option>
        <a-select-option value="2">Except</a-select-option>
      </a-select>
      <a-input :style="{ width: 100, textAlig: 'center' }" placeholder="Minimum" />
      <a-input
        class="site-input-split"
        :style="{
          width: 30,
          borderLef: 0,
          borderRight: 0,
          pointerEvents: 'none',
        }"
        placeholder="~"
        disabled
      />
      <a-input
        class="site-input-right"
        :style="{
          width: 100,
          textAlig: 'center',
        }"
        placeholder="Maximum"
      />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-select default-value="Sign Up" :style="{ width: '30%' }">
        <a-select-option value="Sign Up">Sign Up</a-select-option>
        <a-select-option value="Sign In">Sign In</a-select-option>
      </a-select>
      <a-auto-complete
        :style="{ width: '70%' }"
        placeholder="Email"
        :options="[{ value: 'text 1' }, { value: 'text 2' }]"
      />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-time-picker :style="{ width: '70%' }" />
      <a-cascader
        :style="{ width: '70%' }"
        :options="[
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
        ]"
        placeholder="Select Address"
      />
    </a-space-compact>
    <br />
    <a-space-compact block>
      <a-time-range-picker />
      <a-tree-select
        show-search
        :style="{ width: '60%' }"
        value="leaf1"
        :dropdown-style="{ maxHeight: 400, overflow: 'auto' }"
        placeholder="Please select"
        allow-clear
        tree-default-expand-all
        :tree-data="treeData"
      ></a-tree-select>
      <a-button type="primary">Submit</a-button>
    </a-space-compact>
    <br />
  </div>
</template>

<script lang="ts">
import { CopyOutlined } from '@ant-design/icons-vue';
import { TreeSelectProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    CopyOutlined,
  },
  setup() {
    const treeData = ref<TreeSelectProps['treeData']>([
      {
        title: 'parent 1',
        value: 'parent 1',
        children: [
          {
            title: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                title: 'my leaf',
                value: 'leaf1',
              },
              {
                title: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ]);
    return { treeData };
  },
});
</script>
