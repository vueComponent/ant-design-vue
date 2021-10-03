<docs>
---
order: 4
title:
  zh-CN: 抽屉表单
  en-US: Submit form in drawer
---

## zh-CN

在抽屉中使用表单。

## en-US

Use form in drawer with submit button.

</docs>

<template>
  <a-button type="primary" @click="showDrawer">
    <PlusOutlined />
    New account
  </a-button>
  <a-drawer
    title="Create a new account"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Name" name="name">
            <a-input v-model:value="form.name" placeholder="Please enter user name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Url" name="url">
            <a-input
              v-model:value="form.url"
              style="width: 100%"
              addon-before="http://"
              addon-after=".com"
              placeholder="please enter url"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Owner" name="owner">
            <a-select v-model:value="form.owner" placeholder="Please a-s an owner">
              <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
              <a-select-option value="mao">Maomao Zhou</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Type" name="type">
            <a-select v-model:value="form.type" placeholder="Please choose the type">
              <a-select-option value="private">Private</a-select-option>
              <a-select-option value="public">Public</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Approver" name="approver">
            <a-select v-model:value="form.approver" placeholder="Please choose the approver">
              <a-select-option value="jack">Jack Ma</a-select-option>
              <a-select-option value="tom">Tom Liu</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="DateTime" name="dateTime">
            <a-date-picker
              v-model:value="form.dateTime"
              style="width: 100%"
              :get-popup-container="trigger => trigger.parentNode"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="please enter url description"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </template>
  </a-drawer>
</template>
<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    const form = reactive({
      name: '',
      url: '',
      owner: '',
      type: '',
      approver: '',
      dateTime: '',
      description: '',
    });

    const rules = {
      name: [{ required: true, message: 'Please enter user name' }],
      url: [{ required: true, message: 'please enter url' }],
      owner: [{ required: true, message: 'Please select an owner' }],
      type: [{ required: true, message: 'Please choose the type' }],
      approver: [{ required: true, message: 'Please choose the approver' }],
      dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
      description: [{ required: true, message: 'Please enter url description' }],
    };

    const visible = ref<boolean>(false);

    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };
    return {
      form,
      rules,
      visible,
      showDrawer,
      onClose,
    };
  },
});
</script>
