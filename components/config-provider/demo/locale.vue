<docs>
---
order: 1
title:
  zh-CN: 国际化
  en-US: Locale
---

## zh-CN

此处列出 Ant Design Vue 中需要国际化支持的组件，你可以在演示里切换语言。

## en-US

Components which need localization support are listed here, you can toggle the language in the demo.
</docs>

<template>
  <div style="margin-bottom: 16px">
    <span style="margin-right: 16px">Change locale of components:</span>
    <a-radio-group v-model:value="locale">
      <a-radio-button key="en" :value="enUS.locale">English</a-radio-button>
      <a-radio-button key="cn" :value="zhCN.locale">中文</a-radio-button>
    </a-radio-group>
  </div>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <a-space
      direction="vertical"
      :size="[0, 16]"
      :style="{ width: '100%', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }"
    >
      <a-pagination :total="50" show-size-changer />
      <a-space wrap>
        <a-select show-search style="width: 200px">
          <a-select-option value="jack">jack</a-select-option>
          <a-select-option value="lucy">lucy</a-select-option>
        </a-select>
        <a-date-picker />
        <a-time-picker />
        <a-range-picker style="width: 200px" />
      </a-space>
      <a-space wrap>
        <a-button type="primary" @click="visible = true">Show Modal</a-button>
        <a-button @click="info">Show info</a-button>
        <a-button @click="confirm">Show confirm</a-button>
        <a-popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </a-popconfirm>
      </a-space>
      <a-transfer :data-source="[]" show-search :target-keys="[]" :render="item => item.title" />
      <div
        :style="{
          width: '320px',
          border: `1px solid ${token.colorBorder}`,
          'border-radius': '8px',
        }"
      >
        <a-calendar :fullscreen="false" />
      </div>
      <a-form
        name="basic"
        :model="formModel"
        auto-complete="off"
        :label-col="{ sm: { span: 4 } }"
        :wrapper-col="{ span: 6 }"
      >
        <a-form-item label="UserName" name="username" :rules="[{ required: true }]">
          <a-input v-model:value="formModel.username" :width="200" />
        </a-form-item>
        <a-form-item label="Age" name="age" :rules="[{ type: 'number', min: 0, max: 99 }]">
          <a-input-number v-model:value="formModel.age" :width="200" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 2, span: 6 }">
          <a-button type="primary" html-type="submit">submit</a-button>
        </a-form-item>
      </a-form>
      <a-table :data-source="[]" :columns="columns" />
      <a-modal v-model:open="visible" title="Locale Modal">
        <p>Locale Modal</p>
      </a-modal>
      <a-space wrap :size="80">
        <a-qrcode
          value="https://antdv.com"
          status="expired"
          @refresh="() => console.log('refresh')"
        />
        <a-image
          :width="160"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </a-space>
      <a-upload list-type="picture-card" :file-list="fileList" />
      <a-divider orientation="left">Tour</a-divider>
      <a-button type="primary" @click="() => (tourOpen = true)">Begin Tour</a-button>
      <a-space>
        <a-button ref="ref1">upload</a-button>
        <a-button ref="ref2" type="primary">save</a-button>
        <a-button ref="ref3">
          <template #icon>
            <ellipsis-outlined />
          </template>
        </a-button>
      </a-space>
      <a-tour
        v-model:current="current"
        :open="tourOpen"
        :steps="steps"
        @close="() => (tourOpen = false)"
      ></a-tour>
    </a-space>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Modal, theme } from 'ant-design-vue';
import type { TourProps, UploadFile } from 'ant-design-vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('en');

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'filter1',
        value: 'filter1',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

const visible = ref(false);
const locale = ref(enUS.locale);
watch(locale, val => {
  dayjs.locale(val);
});
const info = () => {
  Modal.info({
    title: 'some info',
    content: 'some info',
  });
};
const confirm = () => {
  Modal.confirm({
    title: 'some info',
    content: 'some info',
  });
};

const formModel = ref({
  username: '',
  age: '100',
});

const { token } = theme.useToken();

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'error',
  },
];

const ref1 = ref(null);
const ref2 = ref(null);
const ref3 = ref(null);
const current = ref(0);
const tourOpen = ref(false);
const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: () => ref1.value && ref1.value.$el,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => ref2.value && ref2.value.$el,
  },
  {
    title: 'Other Actions',
    description: 'Click to see other actions.',
    target: () => ref3.value && ref3.value.$el,
  },
];
</script>
