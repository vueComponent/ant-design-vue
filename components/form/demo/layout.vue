<docs>
---
order: 5
title:
  zh-CN: 表单布局
  en-US: Form Layout
---

## zh-CN

表单有三种布局。

## en-US

There are three layout for form: `horizontal`, `vertical`, `inline`.
</docs>

<template>
  <a-form :layout="formState.layout" :model="formState" v-bind="formItemLayout">
    <a-form-item label="Form Layout" required>
      <a-radio-group v-model:value="formState.layout">
        <a-radio-button value="horizontal">Horizontal</a-radio-button>
        <a-radio-button value="vertical">Vertical</a-radio-button>
        <a-radio-button value="inline">Inline</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="属性类型"
      label-extra-right
      subtitle="（我是备注）"
      description="属性一般是设备的运行状态，如当前温度等；服务是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理。"
    >
      <template #labelExtra>
        <a-button size="small" type="primary">点击</a-button>
      </template>
      <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item
      label="属性名称"
      description="字符长度限制：30字符；字符类型限制：支持中文、字母、数字、-、_和小数点，必须以中文、字母或数字开头。"
    >
      <template #labelExtra>
        <a-avatar size="small" src="https://joeschmoe.io/api/v1/random" />
      </template>
      <a-input v-model:value="formState.fieldB" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  layout: 'horizontal' | 'vertical' | 'inline';
  fieldA: string;
  fieldB: string;
}
export default defineComponent({
  setup() {
    const formState: UnwrapRef<FormState> = reactive({
      layout: 'horizontal',
      fieldA: '',
      fieldB: '',
    });
    const formItemLayout = computed(() => {
      const { layout } = formState;
      return layout === 'horizontal'
        ? {
            labelCol: { span: 9 },
            wrapperCol: { span: 14 },
          }
        : {};
    });
    const buttonItemLayout = computed(() => {
      const { layout } = formState;
      return layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : {};
    });
    return {
      formState,
      formItemLayout,
      buttonItemLayout,
    };
  },
});
</script>
