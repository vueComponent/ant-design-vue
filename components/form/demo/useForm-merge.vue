<docs>
---
order: 8
title:
  zh-CN: useForm 合并错误信息
  en-US: useForm merge status info
---

## zh-CN

通过 [`Form.useForm`](#useform)  合并展示表单校验信息。

## en-US

use [`Form.useForm`](#useform)  combined display form verification information.
</docs>

<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="Activity name" required>
      <a-input v-model:value="modelRef.name" />
    </a-form-item>
    <a-form-item label="Activity zone" required>
      <a-select v-model:value="modelRef.region" placeholder="please select your zone">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Activity type" required>
      <a-checkbox-group v-model:value="modelRef.type">
        <a-checkbox value="1" name="type">Online</a-checkbox>
        <a-checkbox value="2" name="type">Promotion</a-checkbox>
        <a-checkbox value="3" name="type">Offline</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
      <a-button type="primary" @click.prevent="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { reactive, toRaw, computed } from 'vue';
import { toArray } from 'lodash-es';
import { Form } from 'ant-design-vue';

const useForm = Form.useForm;

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const modelRef = reactive({
  name: '',
  region: undefined,
  type: [],
});
const rulesRef = reactive({
  name: [
    {
      required: true,
      message: 'Please input name',
    },
  ],
  region: [
    {
      required: true,
      message: 'Please select region',
    },
  ],
  type: [
    {
      required: true,
      message: 'Please select type',
      type: 'array',
    },
  ],
});
const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(modelRef, rulesRef);
const onSubmit = () => {
  validate()
    .then(() => {
      console.log(toRaw(modelRef));
    })
    .catch(err => {
      console.log('error', err);
    });
};
const errorInfos = computed(() => {
  return mergeValidateInfo(toArray(validateInfos));
});
</script>
<style scoped>
.error-infos :deep(.ant-form-explain) {
  white-space: pre-line;
}
</style>
