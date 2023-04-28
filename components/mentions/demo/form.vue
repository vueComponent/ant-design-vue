<docs>
---
order: 2
title:
  zh-CN: 配合 Form 使用
  en-US: With Form
---

## zh-CN

配合 Form 使用。

## en-US

to work with `Form`.
</docs>

<template>
  <a-form layout="horizontal">
    <a-form-item
      label="Top coders"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      name="coders"
      v-bind="validateInfos.coders"
    >
      <a-mentions v-model:value="modelRef.coders" rows="1" :options="options"></a-mentions>
    </a-form-item>
    <a-form-item
      label="Bio"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      name="bio"
      v-bind="validateInfos.bio"
    >
      <a-mentions
        v-model:value="modelRef.bio"
        rows="3"
        placeholder="You can use @ to ref user here"
        :options="options"
      ></a-mentions>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" @click="handleSubmit">Submit</a-button>
      <a-button style="margin-left: 8px" @click="resetFields">Reset</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { Mentions, Form } from 'ant-design-vue';
import { reactive } from 'vue';

const useForm = Form.useForm;
const { getMentions } = Mentions;
const checkMention = async (_, value) => {
  const mentions = getMentions(value);
  if (mentions.length < 2) {
    return Promise.reject('More than one must be selected!');
  } else {
    return Promise.resolve();
  }
};
const modelRef = reactive({
  bio: '',
  coders: '',
});
const rulesRef = reactive({
  bio: [{ required: true, message: 'Must input bio' }],
  coders: [{ required: true, validator: checkMention }],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
const handleSubmit = e => {
  e.preventDefault();
  validate()
    .then(() => {
      console.log('Submit!!!', modelRef);
    })
    .catch(errors => {
      console.log('Errors in the form!!!', errors);
    });
};
const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
</script>
