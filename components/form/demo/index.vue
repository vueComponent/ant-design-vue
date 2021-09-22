<template>
  <demo-sort :cols="1">
    <Basic />
    <LableWidth />
    <HorizontalLogin />
    <Layout />
    <Validation />
    <CustomValidation />
    <DynamicFormItem />
    <NestedForm />
    <CustomizedFormControls />
    <UseFormBasic />
    <UseFormNested />
    <UseFormTrigger />
    <UseFormMerge />
  </demo-sort>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import CustomValidation from './custom-validation.vue';
import DynamicFormItem from './dynamic-form-item.vue';
import HorizontalLogin from './horizontal-login.vue';
import NestedForm from './nested-form.vue';
import Layout from './layout.vue';
import Validation from './validation.vue';
import UseFormBasic from './useForm-basic.vue';
import UseFormNested from './useForm-nested.vue';
import UseFormTrigger from './useForm-trigger.vue';
import UseFormMerge from './useForm-merge.vue';
import LableWidth from './lable-width.vue';
import CustomizedFormControls from './customized-form-controls.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  US,
  CN,
  components: {
    Basic,
    CustomValidation,
    DynamicFormItem,
    HorizontalLogin,
    NestedForm,
    Layout,
    Validation,
    UseFormBasic,
    UseFormNested,
    UseFormTrigger,
    UseFormMerge,
    LableWidth,
    CustomizedFormControls,
  },
});
</script>
<style>
.code-box-demo .ant-form:not(.ant-form-inline):not(.ant-form-vertical) {
  max-width: 600px;
}
.markdown.api-container table td:nth-of-type(4) {
  white-space: nowrap;
  word-wrap: break-word;
}
</style>
