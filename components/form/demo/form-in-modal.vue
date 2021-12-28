<docs>
---
order: 14
title:
  zh-CN: 弹出层中的新建表单
  en-US: Form in Modal to Create
---

## zh-CN

当用户访问一个展示了某个列表的页面，想新建一项但又不想跳转页面时，可以用 Modal 弹出一个表单，用户填写必要信息后创建新的项。

## en-US

When user visit a page with a list of items, and want to create a new item. The page can popup a form in Modal, then let user fill in the form to create an item.

</docs>
<template>
  <div>
    <a-button type="primary" @click="visible = true">New Collection</a-button>
    <a-modal
      v-model:visible="visible"
      title="Create a new collection"
      ok-text="Create"
      cancel-text="Cancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formState" layout="vertical" name="form_in_modal">
        <a-form-item
          name="title"
          label="Title"
          :rules="[{ required: true, message: 'Please input the title of collection!' }]"
        >
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item name="description" label="Description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
        <a-form-item name="modifier" class="collection-create-form_last-form-item">
          <a-radio-group v-model:value="formState.modifier">
            <a-radio value="public">Public</a-radio>
            <a-radio value="private">Private</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue';
import type { FormInstance } from 'ant-design-vue';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInstance>();
    const visible = ref(false);
    const formState = reactive<Values>({
      title: '',
      description: '',
      modifier: 'public',
    });

    const onOk = () => {
      formRef.value
        .validateFields()
        .then(values => {
          console.log('Received values of form: ', values);
          console.log('formState: ', toRaw(formState));
          visible.value = false;
          formRef.value.resetFields();
          console.log('reset formState: ', toRaw(formState));
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    };

    return {
      formState,
      formRef,
      visible,
      onOk,
    };
  },
});
</script>
<style>
.collection-create-form_last-form-item {
  margin-bottom: 0;
}
</style>
