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
    <a-form-item label="Form Layout">
      <a-radio-group v-model:value="formState.layout">
        <a-radio-button value="horizontal">Horizontal</a-radio-button>
        <a-radio-button value="vertical">Vertical</a-radio-button>
        <a-radio-button value="inline">Inline</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Field A">
      <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item label="Field B">
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
            labelCol: { span: 4 },
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
