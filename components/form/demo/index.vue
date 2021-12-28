<template>
  <demo-sort :cols="1">
    <Basic />
    <LableWidth />
    <HorizontalLogin />
    <Layout />
    <inlineLoginVue />
    <normalLoginVue />
    <!-- <Validation /> -->
    <CustomValidation />
    <DynamicFormItem />
    <NestedForm />
    <CustomizedFormControls />
    <advancedSearchVue />
    <dynamicFormItemsComplexVue />
    <dynamicFormItemsVue />
    <dynamicRuleVue />
    <formContextVue />
    <formInModalVue />
    <timeRelatedControlsVue />
    <validateOtherVue />
    <UseFormBasic />
    <UseFormNested />
    <UseFormTrigger />
    <UseFormMerge />
  </demo-sort>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import advancedSearchVue from './advanced-search.vue';
import Basic from './basic.vue';
import CustomValidation from './custom-validation.vue';
import DynamicFormItem from './dynamic-form-item.vue';
import dynamicFormItemsComplexVue from './dynamic-form-items-complex.vue';
import dynamicFormItemsVue from './dynamic-form-items.vue';
import dynamicRuleVue from './dynamic-rule.vue';
import formContextVue from './form-context.vue';
import formInModalVue from './form-in-modal.vue';
import HorizontalLogin from './horizontal-login.vue';
import inlineLoginVue from './inline-login.vue';
import LableWidth from './lable-width.vue';
import Layout from './layout.vue';
import NestedForm from './nest-messages.vue';
import normalLoginVue from './normal-login.vue';
// import Validation from './validation.vue';
import UseFormBasic from './useForm-basic.vue';
import UseFormNested from './useForm-nested.vue';
import UseFormTrigger from './useForm-trigger.vue';
import UseFormMerge from './useForm-merge.vue';
import CustomizedFormControls from './customized-form-controls.vue';
import timeRelatedControlsVue from './time-related-controls.vue';
import validateOtherVue from './validate-other.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default defineComponent({
  US,
  CN,
  components: {
    timeRelatedControlsVue,
    validateOtherVue,
    Basic,
    CustomValidation,
    DynamicFormItem,
    HorizontalLogin,
    NestedForm,
    Layout,
    // Validation,
    UseFormBasic,
    UseFormNested,
    UseFormTrigger,
    UseFormMerge,
    LableWidth,
    CustomizedFormControls,
    advancedSearchVue,
    dynamicFormItemsComplexVue,
    dynamicFormItemsVue,
    dynamicRuleVue,
    formContextVue,
    formInModalVue,
    inlineLoginVue,
    normalLoginVue,
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
