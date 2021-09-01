<docs>
---
order: 11
title:
  zh-CN: 嵌套表单
  en-US: Nested Form
---
  
## zh-CN
  
嵌套表单
  
## en-US

Nested form.
</docs>

<template>
  <div>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="Activity name" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="Sub name" :name="['sub', 'name']">
        <a-input v-model:value="formState.sub.name" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">Create</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue';

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState = reactive({
      name: undefined,
      sub: { name: undefined },
    });
    const rules = {
      name: {
        required: true,
        message: 'Please input name',
      },
      sub: {
        name: [
          {
            required: true,
            message: 'Please input name',
          },
        ],
      },
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', formState, toRaw(formState));
        })
        .catch(error => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>
