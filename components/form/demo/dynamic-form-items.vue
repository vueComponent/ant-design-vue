<docs>
---
order: 4.1
title:
  zh-CN: 动态增减嵌套字段
  en-US: Dynamic Form nest Items
---

## zh-CN

通过数组 name 绑定嵌套字段

## en-US

Bind nested fields by array name.

</docs>
<template>
  <a-form
    ref="formRef"
    name="dynamic_form_nest_item"
    :model="dynamicValidateForm"
    @finish="onFinish"
  >
    <a-space
      v-for="(user, index) in dynamicValidateForm.users"
      :key="user.id"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <a-form-item
        :name="['users', index, 'first']"
        :rules="{
          required: true,
          message: 'Missing first name',
        }"
      >
        <a-input v-model:value="user.first" placeholder="First Name" />
      </a-form-item>
      <a-form-item
        :name="['users', index, 'last']"
        :rules="{
          required: true,
          message: 'Missing last name',
        }"
      >
        <a-input v-model:value="user.last" placeholder="Last Name" />
      </a-form-item>
      <MinusCircleOutlined @click="removeUser(user)" />
    </a-space>
    <a-form-item>
      <a-button type="dashed" block @click="addUser">
        <PlusOutlined />
        Add user
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';

interface User {
  first: string;
  last: string;
  id: number;
}
export default defineComponent({
  components: {
    MinusCircleOutlined,
    PlusOutlined,
  },
  setup() {
    const formRef = ref<FormInstance>();
    const dynamicValidateForm = reactive<{ users: User[] }>({
      users: [],
    });
    const removeUser = (item: User) => {
      let index = dynamicValidateForm.users.indexOf(item);
      if (index !== -1) {
        dynamicValidateForm.users.splice(index, 1);
      }
    };
    const addUser = () => {
      dynamicValidateForm.users.push({
        first: '',
        last: '',
        id: Date.now(),
      });
    };
    const onFinish = values => {
      console.log('Received values of form:', values);
      console.log('dynamicValidateForm.users:', dynamicValidateForm.users);
    };
    return {
      formRef,
      dynamicValidateForm,
      onFinish,
      removeUser,
      addUser,
    };
  },
});
</script>
