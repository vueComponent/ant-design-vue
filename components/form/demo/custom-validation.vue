<docs>
---
order: 1
title:
  zh-CN: 自定义校验规则
  en-US: Custom validation rules
---

## zh-CN

这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。本例还使用 `has-feedback` 属性为输入框添加了表示校验结果的反馈图标。
更多高级用法可参考 [async-validator](https://github.com/yiminghe/async-validator)

## en-US

This example shows how to customize your own validation rules to finish a two-factor password verification.
You can use `has-feedback` to reflect validation result as an icon.
See more advanced usage at [async-validator](https://github.com/yiminghe/async-validator).
</docs>

<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="Password" name="pass">
      <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback label="Confirm" name="checkPass">
      <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback label="Age" name="age">
      <a-input-number v-model:value="formState.age" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';
import { defineComponent, reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
interface FormState {
  pass: string;
  checkPass: string;
  age: number | undefined;
}
export default defineComponent({
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      pass: '',
      checkPass: '',
      age: undefined,
    });
    let checkAge = async (_rule: RuleObject, value: number) => {
      if (!value) {
        return Promise.reject('Please input the age');
      }
      if (!Number.isInteger(value)) {
        return Promise.reject('Please input digits');
      } else {
        if (value < 18) {
          return Promise.reject('Age must be greater than 18');
        } else {
          return Promise.resolve();
        }
      }
    };
    let validatePass = async (_rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (_rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      pass: [{ required: true, validator: validatePass, trigger: 'change' }],
      checkPass: [{ validator: validatePass2, trigger: 'change' }],
      age: [{ validator: checkAge, trigger: 'change' }],
    };
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const handleFinish = (values: FormState) => {
      console.log(values, formState);
    };
    const handleFinishFailed = errors => {
      console.log(errors);
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
    };
  },
});
</script>
